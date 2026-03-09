import React, { useState, useEffect, useCallback, useMemo } from 'react';

const CRUDModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  type, 
  data, 
  onSave, 
  fields = [], 
  hotels = [] 
}) => {
  const [formData, setFormData] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize dependencies
  const memoizedFields = useMemo(() => fields, [JSON.stringify(fields)]);
  const memoizedHotels = useMemo(() => hotels, [JSON.stringify(hotels)]);
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(image => {
        if (image.preview) URL.revokeObjectURL(image.preview);
      });
    };
  }, [previewImages]);

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      const newInitialData = {};
      
      if (mode === 'edit' && memoizedData && Object.keys(memoizedData).length > 0) {
        // Edit mode: Populate with existing data
        Object.keys(memoizedData).forEach(key => {
          if (key === 'amenities') {
            // Handle amenities - could be JSON string or array
            try {
              const amenities = typeof memoizedData[key] === 'string' 
                ? JSON.parse(memoizedData[key]) 
                : memoizedData[key];
              newInitialData[key] = Array.isArray(amenities) ? amenities : [];
            } catch (e) {
              newInitialData[key] = [];
            }
          } else {
            newInitialData[key] = memoizedData[key];
          }
        });
        
        // Initialize preview images based on type
        if (memoizedData.images) {
          let images = [];
          try {
            images = typeof memoizedData.images === 'string' 
              ? JSON.parse(memoizedData.images) 
              : memoizedData.images;
          } catch (e) {
            images = Array.isArray(memoizedData.images) ? memoizedData.images : [];
          }
          
          if (type === 'room-type') {
            // For room types: 4 fixed image slots
            const imageSlots = Array(4).fill(null);
            images.forEach((img, index) => {
              if (index < 4) {
                imageSlots[index] = {
                  url: typeof img === 'string' ? img : img.url,
                  id: img.id || `existing_${index}`,
                  isExisting: true,
                  index: index + 1,
                  name: `Image ${index + 1}`,
                  isEmpty: false
                };
              }
            });
            
            setPreviewImages(imageSlots.map((slot, index) => 
              slot || {
                index: index + 1,
                name: `Image ${index + 1}`,
                isNew: false,
                isEmpty: true
              }
            ));
          } else {
            // For hotels: up to 9 images
            setPreviewImages(images.map((img, index) => ({
              url: typeof img === 'string' ? img : img.url,
              id: img.id || `existing_${index}`,
              isExisting: true,
              index: index + 1,
              name: `Image ${index + 1}`
            })));
          }
        }
      } else {
        // Create mode: Initialize with default values
        memoizedFields.forEach(field => {
          if (field.type === 'number') {
            newInitialData[field.name] = 0;
          } else if (field.type === 'select') {
            if (field.name === 'hotel_id' && memoizedHotels.length > 0) {
              newInitialData[field.name] = memoizedHotels[0].uuid;
            } else if (field.options && field.options.length > 0) {
              const firstOption = field.options[0];
              newInitialData[field.name] = firstOption.value || firstOption;
            } else {
              newInitialData[field.name] = '';
            }
          } else if (field.type === 'multiselect') {
            newInitialData[field.name] = [];
          } else if (field.type === 'file') {
            newInitialData[field.name] = null;
          } else {
            newInitialData[field.name] = '';
          }
        });
        
        // Initialize preview images based on type
        if (type === 'room-type') {
          setPreviewImages(
            Array(4).fill().map((_, index) => ({
              index: index + 1,
              name: `Image ${index + 1}`,
              isNew: false,
              isEmpty: true
            }))
          );
        } else {
          setPreviewImages([]);
        }
        setFilesToUpload([]);
        setImagesToDelete([]);
      }
      
      setFormData(newInitialData);
    } else {
      // Reset form when closing
      setFormData({});
      setPreviewImages([]);
      setFilesToUpload([]);
      setImagesToDelete([]);
      setIsSubmitting(false);
    }
  }, [isOpen, mode, memoizedData, memoizedFields, memoizedHotels, type]);

  const handleChange = useCallback((e) => {
    const { name, value, type: inputType } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'number' ? (value === '' ? '' : parseFloat(value) || 0) : value
    }));
  }, []);

  const handleImageChange = (e, slotIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2048 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPEG, PNG, JPG, and GIF files are allowed');
      return;
    }

    if (type === 'room-type') {
      const newPreviews = [...previewImages];
      const newFiles = [...filesToUpload];
      
      // If replacing an existing image, mark old one for deletion
      if (newPreviews[slotIndex]?.isExisting) {
        setImagesToDelete(prev => [...prev, newPreviews[slotIndex].url || newPreviews[slotIndex].id]);
      }
      
      // If replacing a file that hasn't been uploaded yet, remove it from filesToUpload
      if (newPreviews[slotIndex]?.isNew) {
        const fileIndex = newFiles.findIndex(f => 
          f.name === newPreviews[slotIndex].file.name && 
          f.size === newPreviews[slotIndex].file.size
        );
        if (fileIndex !== -1) {
          newFiles.splice(fileIndex, 1);
        }
      }
      
      // Update the preview
      newPreviews[slotIndex] = {
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        index: slotIndex + 1,
        name: `Image ${slotIndex + 1}`,
        size: (file.size / 1024 / 1024).toFixed(2),
        isEmpty: false
      };
      
      setPreviewImages(newPreviews);
      setFilesToUpload([...newFiles, file]);
    } else {
      // Original behavior for hotels
      const files = Array.from(e.target.files);
      const maxImages = 9;
      const currentImageCount = previewImages.length;
      const availableSlots = maxImages - currentImageCount;
      
      if (files.length > availableSlots) {
        alert(`You can only upload ${availableSlots} more images. Maximum ${maxImages} images allowed.`);
        return;
      }
      
      const newPreviews = files.map((file, index) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        index: currentImageCount + index + 1,
        name: `Image ${currentImageCount + index + 1}`,
        size: (file.size / 1024 / 1024).toFixed(2)
      }));
      
      setPreviewImages([...previewImages, ...newPreviews]);
      setFilesToUpload([...filesToUpload, ...files]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    if (type === 'room-type') {
      const newPreviews = [...previewImages];
      const newFiles = [...filesToUpload];
      
      // If removing an existing image, mark for deletion
      if (newPreviews[indexToRemove]?.isExisting) {
        setImagesToDelete(prev => [...prev, newPreviews[indexToRemove].url || newPreviews[indexToRemove].id]);
      }
      
      // If removing a file that hasn't been uploaded yet, remove it from filesToUpload
      if (newPreviews[indexToRemove]?.isNew) {
        const fileIndex = newFiles.findIndex(f => 
          f.name === newPreviews[indexToRemove].file.name && 
          f.size === newPreviews[indexToRemove].file.size
        );
        if (fileIndex !== -1) {
          newFiles.splice(fileIndex, 1);
        }
        
        // Revoke the object URL to prevent memory leaks
        if (newPreviews[indexToRemove].preview) {
          URL.revokeObjectURL(newPreviews[indexToRemove].preview);
        }
      }
      
      // Empty the slot but keep the position
      newPreviews[indexToRemove] = {
        index: indexToRemove + 1,
        name: `Image ${indexToRemove + 1}`,
        isNew: false,
        isEmpty: true
      };
      
      setPreviewImages(newPreviews);
      setFilesToUpload(newFiles);
    } else {
      // Original behavior for hotels
      const imageToRemove = previewImages[indexToRemove];
      
      if (imageToRemove.isExisting && imageToRemove.id) {
        setImagesToDelete([...imagesToDelete, imageToRemove.id]);
      }
      
      const newPreviews = previewImages.filter((_, index) => index !== indexToRemove);
      const reIndexedPreviews = newPreviews.map((img, index) => ({
        ...img,
        index: index + 1,
        name: `Image ${index + 1}`
      }));
      
      setPreviewImages(reIndexedPreviews);
      
      if (imageToRemove.isNew) {
        const newFiles = filesToUpload.filter(file => 
          !(file.name === imageToRemove.file.name && file.size === imageToRemove.file.size)
        );
        setFilesToUpload(newFiles);
        
        // Revoke object URL
        if (imageToRemove.preview) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    for (const field of memoizedFields) {
      if (field.required) {
        // Special validation for images
        if (field.type === 'file' && field.name === 'images') {
          if (type === 'room-type') {
            // For room types, at least one image should be provided
            const hasImages = previewImages.some(img => !img.isEmpty && (img.isNew || img.isExisting));
            if (!hasImages) {
              alert('At least one image is required for room types.');
              setIsSubmitting(false);
              return;
            }
          } else if (previewImages.length === 0) {
            alert(`${field.label} is required. Please upload at least one image.`);
            setIsSubmitting(false);
            return;
          }
          continue;
        }

        const value = formData[field.name];
        if (value === undefined || value === null || String(value).trim() === '') {
          alert(`${field.label} is required.`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    try {
      let dataToSend;
      
      // Always use FormData when there are file uploads or for room types
      const shouldUseFormData = filesToUpload.length > 0 || type === 'room-type';
      
      if (shouldUseFormData) {
        dataToSend = new FormData();
        
        // Append all regular fields
        Object.keys(formData).forEach(key => {
          if (key !== 'images') {
            const value = formData[key];
            
            if (key === 'amenities' && Array.isArray(value)) {
              value.forEach((amenity, index) => {
                dataToSend.append(`amenities[${index}]`, amenity);
              });
            } else if (Array.isArray(value)) {
              value.forEach((item, index) => {
                dataToSend.append(`${key}[${index}]`, item);
              });
            } else if (value !== null && value !== undefined) {
              dataToSend.append(key, value);
            }
          }
        });
        
        // Handle images based on type
        if (type === 'room-type') {
          // For room types: handle the 4 image slots
          let newImageIndex = 0;
          previewImages.forEach((img, index) => {
            if (img.isNew && img.file) {
              dataToSend.append(`images[${newImageIndex}]`, img.file);
              newImageIndex++;
            }
          });

          // For edit mode, include existing images and deletions
          if (mode === 'edit') {
            const existingImages = previewImages
              .filter(img => img.isExisting && !img.isEmpty)
              .map(img => img.url || img.id);
            
            existingImages.forEach((imageUrl, index) => {
              dataToSend.append(`existing_images[${index}]`, imageUrl);
            });

            if (imagesToDelete.length > 0) {
              imagesToDelete.forEach((imageId, index) => {
                dataToSend.append(`deleted_images[${index}]`, imageId);
              });
            }
          }
        } else {
          // For hotels: handle up to 9 images
          filesToUpload.forEach((file, index) => {
            dataToSend.append('images[]', file);
          });
          
          if (mode === 'edit') {
            const existingImages = previewImages
              .filter(img => img.isExisting)
              .map(img => img.url);
            
            if (existingImages.length > 0) {
              existingImages.forEach((imageUrl, index) => {
                dataToSend.append(`existing_images[${index}]`, imageUrl);
              });
            }

            if (imagesToDelete.length > 0) {
              imagesToDelete.forEach((imageId, index) => {
                dataToSend.append(`deleted_images[${index}]`, imageId);
              });
            }
          }
        }
      } else {
        // Regular JSON data (no file uploads and not room-type)
        dataToSend = { ...formData };
        
        if (mode === 'edit') {
          const existingImages = previewImages
            .filter(img => img.isExisting)
            .map(img => img.url);
          
          if (existingImages.length > 0) {
            dataToSend.existing_images = existingImages;
          }
          
          if (imagesToDelete.length > 0) {
            dataToSend.deleted_images = imagesToDelete;
          }
        }
      }
      
      await onSave(dataToSend);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = useCallback((e) => {
    // Disabled: don't close on overlay click to prevent accidental dismissal
  }, [onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  // Helper: render a single field's input
  const renderFieldInput = (field) => {
    if (field.type === 'file') return null;

    return (
      <div>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors text-sm"
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
          >
            {field.name === 'hotel_id' && memoizedHotels.length > 0 ? (
              memoizedHotels.map(hotel => (
                <option key={hotel.uuid} value={hotel.uuid}>{hotel.name}</option>
              ))
            ) : (
              field.options?.map(option => {
                const optionValue = option.value || option;
                const optionLabel = option.label || option;
                return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
              }) || []
            )}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.name}
            name={field.name}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors resize-vertical text-sm"
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder || ''}
            rows={3}
          />
        ) : field.type === 'multiselect' ? (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((option) => {
              const isSelected = Array.isArray(formData[field.name]) && formData[field.name].includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const currentValues = Array.isArray(formData[field.name]) ? formData[field.name] : [];
                    const newValues = isSelected
                      ? currentValues.filter(v => v !== option)
                      : [...currentValues, option];
                    setFormData(prev => ({ ...prev, [field.name]: newValues }));
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {isSelected && <span className="mr-1">✓</span>}
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors text-sm"
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder || ''}
            min={field.type === 'number' ? field.min : undefined}
            max={field.type === 'number' ? field.max : undefined}
            step={field.type === 'number' ? field.step : undefined}
          />
        )}
      </div>
    );
  };

  // Build layout: group fields into sections and grid rows
  const buildFormLayout = () => {
    const elements = [];
    let i = 0;
    let sectionCount = 0;

    while (i < memoizedFields.length) {
      const field = memoizedFields[i];
      if (field.type === 'file') { i++; continue; }

      // Section header
      if (field.section) {
        elements.push(
          <div key={`section-${field.section}`} className={sectionCount > 0 ? 'pt-5 mt-3 border-t border-gray-100' : ''}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{field.section}</h3>
          </div>
        );
        sectionCount++;
      }

      // Pair consecutive half-width fields in a grid row
      const nextField = i + 1 < memoizedFields.length ? memoizedFields[i + 1] : null;
      if (field.half && nextField && nextField.half && nextField.type !== 'file') {
        // Render second field's section header if it has one (edge case)
        if (nextField.section) {
          elements.push(
            <div key={`section-${nextField.section}`} className="pt-5 mt-3 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{nextField.section}</h3>
            </div>
          );
          sectionCount++;
        }
        elements.push(
          <div key={`row-${field.name}-${nextField.name}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderFieldInput(field)}
            {renderFieldInput(nextField)}
          </div>
        );
        i += 2;
      } else {
        elements.push(<div key={field.name}>{renderFieldInput(field)}</div>);
        i++;
      }
    }
    return elements;
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-gray-900">
              {mode === 'create'
                ? `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`
                : `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`
              }
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {mode === 'create' ? 'Fill in the details below' : 'Update the details below'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <form id="crud-modal-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Render fields with section/grid support */}
            {buildFormLayout()}

            {/* Image Upload Section */}
            {memoizedFields.some(f => f.name === 'images') && (
              <div className="pt-5 mt-3 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'room-type' ? 'Room Type Images (4 max)' : 'Hotel Images (9 max)'}
                  {memoizedFields.find(f => f.name === 'images')?.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {type === 'room-type' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-xl overflow-hidden h-32">
                        {img.isEmpty ? (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <label className="cursor-pointer text-center p-2">
                              <div className="text-gray-300 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-500">Image {index + 1}</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, index)} />
                            </label>
                          </div>
                        ) : (
                          <>
                            <img src={img.preview || img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                              {img.name}{img.size && <span className="block">{img.size} MB</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={`Remove ${img.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Drag-and-drop style upload zone */}
                    <label className={`block cursor-pointer ${previewImages.length >= 9 ? 'pointer-events-none' : ''}`}>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                        previewImages.length >= 9
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-blue-200 bg-blue-50/30 hover:border-blue-400 hover:bg-blue-50/60'
                      }`}>
                        <svg className="mx-auto h-10 w-10 text-blue-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {previewImages.length}/9 images &middot; PNG, JPG, GIF up to 2MB each
                          {previewImages.length >= 9 && <span className="text-red-500 ml-1">(Maximum reached)</span>}
                        </p>
                      </div>
                      <input type="file" multiple onChange={(e) => handleImageChange(e)} accept="image/*" className="hidden" disabled={previewImages.length >= 9} />
                    </label>

                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                        {previewImages.map((img, index) => (
                          <div key={index} className="relative group border border-gray-200 rounded-xl overflow-hidden aspect-square">
                            <img src={img.preview || img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                              {img.name}{img.size && <span className="block">{img.size} MB</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={`Remove ${img.name}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="crud-modal-form"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-50 shadow-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </span>
            ) : mode === 'create' ? 'Create' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRUDModal;