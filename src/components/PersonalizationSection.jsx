import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, X, Lock, Sparkles, Image as ImageIcon, Printer } from 'lucide-react';
import * as faceapi from 'https://esm.sh/@vladmandic/face-api';
import { useAuth } from '../context/AuthContext';
import { getAuthorizeUrl } from '../utils/auth';

export default function PersonalizationSection({ book }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [uploadedPhoto, setUploadedPhoto] = React.useState(null);
    const [isValidating, setIsValidating] = React.useState(false);
    const [showWarning, setShowWarning] = React.useState(false);
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [formData, setFormData] = React.useState({
        language: 'English',
        name: '',
        age: ''
    });
    
    const fileInputRef = React.useRef(null);

    // Load models on mount
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://vladmandic.github.io/face-api/model/';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        };
        loadModels();
    }, []);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setIsValidating(true);
            const reader = new FileReader();
            reader.onload = async (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = async () => {
                    try {
                        // Resizing logic for localStorage safety
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 500;
                        const MAX_HEIGHT = 500;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);
                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

                        // Detect faces on the original or compressed image
                        const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
                        
                        if (detections.length > 0) {
                            setUploadedPhoto(compressedBase64);
                            setShowWarning(false);
                        } else {
                            setShowWarning(true);
                        }
                    } catch (err) {
                        console.error("Face detection error:", err);
                        setUploadedPhoto(event.target.result);
                    } finally {
                        setIsValidating(false);
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleRemovePhoto = () => {
        setUploadedPhoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (!book?.image) {
        return null;
    }


    return (
        <section className="bg-[#E0EBFF] pt-9 pb-5 md:pt-11 md:pb-9 overflow-hidden relative">
            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-sm p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300 relative">
                        <button 
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <div className="w-20 h-20 bg-[#FDE2FF] rounded-sm flex items-center justify-center mx-auto">
                            <Lock className="w-10 h-10 text-[#2563EB]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">Save Your Magic!</h3>
                            <p className="text-gray-500 font-medium">Please login to securely save your child's personalization and see the AI-generated preview.</p>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={async () => {
                                    try {
                                        const url = await getAuthorizeUrl();
                                        window.location.href = url;
                                    } catch (err) {
                                        console.error("Login redirect failed:", err);
                                    }
                                }}
                                className="w-full bg-[#2563EB] text-white py-4 rounded-sm font-bold hover:bg-[#1d4ed8] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Sparkles className="w-5 h-5" /> Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-sm p-8 max-w-sm w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-[#FFE2E2] rounded-sm flex items-center justify-center mx-auto">
                            <X className="w-10 h-10 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">No Face Detected!</h3>
                            <p className="text-gray-500 font-medium">We couldn't find a clear face in this photo. Please upload a front-facing photo of your child for the best results.</p>
                        </div>
                        <button 
                            onClick={() => setShowWarning(false)}
                            className="w-full bg-gray-900 text-white py-4 rounded-sm font-bold hover:bg-gray-800 transition shadow-lg cursor-pointer"
                        >
                            Try Another Photo
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left side: Information & Steps */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                Start Personalising
                            </h2>
                            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl">
                                Personalise your storybook by uploading your child's photo. 
                                Preview the book, place your order, we'll print 
                                and deliver it to your home.
                            </p>
                        </div>

                        {/* Steps Visual */}
                        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-sm border-2 border-dashed ${uploadedPhoto ? 'border-green-500 bg-green-50' : 'border-[#2563EB]/30 bg-white'} flex items-center justify-center shadow-sm`}>
                                        {isValidating ? <div className="w-8 h-8 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin"></div> : (uploadedPhoto ? <Check className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-[#2563EB]" />)}
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#2563EB] text-white rounded-sm flex items-center justify-center font-bold text-sm border-2 border-[#E0EBFF]">
                                        1
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-800 leading-tight">Upload Child's Picture</span>
                            </div>

                            {/* Step 2 */}
                            <div className={`flex flex-col items-center text-center space-y-4 transition ${uploadedPhoto ? 'opacity-100' : 'opacity-50'}`}>
                                <div className="relative">
                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-sm border-2 border-dashed ${uploadedPhoto ? 'border-[#2563EB]' : 'border-[#2563EB]/30'} flex items-center justify-center bg-white shadow-sm overflow-hidden text-[#2563EB]`}>
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#2563EB] text-white rounded-sm flex items-center justify-center font-bold text-sm border-2 border-[#E0EBFF]">
                                        2
                                    </div>
                                </div>
                                <span className={`text-sm font-bold leading-tight ${uploadedPhoto ? 'text-gray-800' : 'text-gray-400'}`}>Preview Book and Order</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center space-y-4 opacity-50 text-[#2563EB]/40">
                                <div className="relative">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-sm border-2 border-dashed border-[#2563EB]/30 flex items-center justify-center bg-white shadow-sm">
                                        <Printer className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#2563EB]/20 text-white rounded-sm flex items-center justify-center font-bold text-sm border-2 border-[#E0EBFF]">
                                        3
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-400 leading-tight">Premium Print, Delivered to Your Door</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Action Card */}
                    <div id="upload-image-section" className="lg:col-span-5 relative">
                        <div className="bg-white rounded-md p-8 shadow-2xl shadow-blue-100/50 border border-blue-50 relative z-10 min-h-[480px] flex flex-col justify-center">
                            
                            {isValidating ? (
                                <div className="text-center space-y-6 animate-pulse">
                                    <div className="w-24 h-24 bg-[#E2E0FF] rounded-sm flex items-center justify-center mx-auto border-4 border-dashed border-blue-200">
                                        <div className="w-10 h-10 border-4 border-blue-100 border-t-[#2563EB] rounded-full animate-spin"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900">Validating Photo...</h3>
                                        <p className="text-gray-500 font-medium">Our AI is checking for a clear face.</p>
                                    </div>
                                </div>
                            ) : !uploadedPhoto ? (
                                <>
                                    {/* TIPS View */}
                                    <div className="text-center mb-8 animate-in fade-in duration-500">
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">TIPS</h3>
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 flex flex-col items-center gap-2">
                                                <div className="relative">
                                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden border-2 border-green-500 p-0.5">
                                                        <img src="https://images.unsplash.com/photo-1544126592-807daa215a05?q=80&w=200&h=200&auto=format&fit=crop" alt="Good" className="w-full h-full object-cover rounded-sm" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-sm p-0.5 border-2 border-white">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight">Clear front-facing photo</span>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center gap-2">
                                                <div className="relative opacity-60">
                                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden border-2 border-red-500 p-0.5">
                                                        <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-sm" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-sm p-0.5 border-2 border-white">
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No eating or covered face</span>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center gap-2">
                                                <div className="relative opacity-60">
                                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden border-2 border-red-500 p-0.5">
                                                        <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-sm" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-sm p-0.5 border-2 border-white">
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No accessories</span>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center gap-2">
                                                <div className="relative opacity-60">
                                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm overflow-hidden border-2 border-red-500 p-0.5">
                                                        <img src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=200&h=200&auto=format&fit=crop" alt="Bad" className="w-full h-full object-cover rounded-sm" />
                                                    </div>
                                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-sm p-0.5 border-2 border-white">
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                </div>
                                                <span className="text-[10px] md:text-xs font-bold text-gray-400 leading-tight">No far away or side angle</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Button */}
                                    <div className="space-y-4">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                        <button 
                                            onClick={handleUploadClick}
                                            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-5 px-6 rounded-sm font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-100 cursor-pointer"
                                        >
                                            Child's Photo <Upload className="w-6 h-6" />
                                        </button>
                                        <p className="text-center text-sm font-bold text-gray-400">drop a photo or click on the button</p>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                    {/* Uploaded Preview */}
                                    <div className="flex justify-center relative">
                                        <div className="w-28 h-28 rounded-sm border-2 border-blue-200 relative p-1 shadow-sm">
                                            <img src={uploadedPhoto} alt="Uploaded" className="w-full h-full object-cover object-center rounded-sm" />
                                            <button 
                                                onClick={handleRemovePhoto}
                                                className="absolute -top-1 -right-1 bg-white border border-gray-100 shadow-md rounded-sm p-1.5 hover:bg-gray-50 transition z-20 cursor-pointer"
                                            >
                                                <X className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">Book Language</label>
                                            <select 
                                                className="w-full bg-gray-50 border border-gray-100 rounded-sm py-4 px-6 focus:ring-2 focus:ring-[#2563EB]/20 outline-none font-bold text-gray-700 transition"
                                                value={formData.language}
                                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                                            >
                                                <option>English</option>
                                                <option>Telugu</option>
                                                <option>Hindi</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">Child's Name</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        maxLength={25}
                                                        placeholder="Name"
                                                        className={`w-full bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-100'} rounded-sm py-4 px-6 focus:ring-2 focus:ring-[#2563EB]/20 outline-none font-bold text-gray-700 transition`}
                                                        value={formData.name}
                                                        onChange={(e) => {
                                                            setFormData({...formData, name: e.target.value});
                                                            if (errors.name) setErrors({...errors, name: null});
                                                        }}
                                                    />
                                                    <span className="absolute right-4 bottom-2 text-[10px] font-bold text-gray-300">{formData.name.length}/25</span>
                                                </div>
                                                {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 px-2">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">Child's Age</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="Age"
                                                    className={`w-full bg-gray-50 border ${errors.age ? 'border-red-500' : 'border-gray-100'} rounded-sm py-4 px-6 focus:ring-2 focus:ring-[#2563EB]/20 outline-none font-bold text-gray-700 transition`}
                                                    value={formData.age}
                                                    onChange={(e) => {
                                                        setFormData({...formData, age: e.target.value});
                                                        if (errors.age) setErrors({...errors, age: null});
                                                    }}
                                                />
                                                {errors.age && <p className="text-[10px] text-red-500 font-bold mt-1 px-2">{errors.age}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button 
                                            disabled={isValidating}
                                            onClick={async () => {
                                                if (!user) {
                                                    setShowLoginModal(true);
                                                    return;
                                                }

                                                const nameRegex = /^[a-zA-Z]/;
                                                const newErrors = {};

                                                if (!uploadedPhoto) {
                                                    alert("Please upload a photo first.");
                                                    return;
                                                }
                                                
                                                if (!formData.name || formData.name.length < 2) {
                                                    newErrors.name = "Min 2 characters required";
                                                } else if (!nameRegex.test(formData.name)) {
                                                    newErrors.name = "Must start with a letter";
                                                }

                                                if (!formData.age) {
                                                    newErrors.age = "Required";
                                                } else if (parseInt(formData.age) > 10) {
                                                    newErrors.age = "Max age is 10 years";
                                                }

                                                if (Object.keys(newErrors).length > 0) {
                                                    setErrors(newErrors);
                                                    return;
                                                }

                                                try {
                                                    setIsValidating(true);
                                                    
                                                    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                                                    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
                                                    
                                                    if (!cloudName || !preset) {
                                                        throw new Error("Cloudinary configuration missing in environment variables.");
                                                    }

                                                    const uploadData = new FormData();
                                                    uploadData.append('file', uploadedPhoto);
                                                    uploadData.append('upload_preset', preset);
                                                    
                                                    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                                                        method: 'POST',
                                                        body: uploadData
                                                    });
                                                    
                                                    const result = await response.json();
                                                    console.log("Cloudinary Response:", result);

                                                    if (!result.secure_url) {
                                                        throw new Error(result.error?.message || "Upload failed");
                                                    }

                                                    localStorage.setItem('last_personalization', JSON.stringify({
                                                        ...formData,
                                                        photo: result.secure_url,
                                                        productId: book.id,
                                                        variantId: book.variantId,
                                                        title: book.title,
                                                        description: book.description,
                                                        bookCover: book.image
                                                    }));


                                                    navigate('/preview');
                                                } catch (err) {
                                                    console.error("Cloudinary Error Detail:", err);
                                                    alert(`Upload Error: ${err.message || 'Check your connection'}`);
                                                } finally {
                                                    setIsValidating(false);
                                                }
                                            }}
                                            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-5 px-6 rounded-sm font-black text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-100 mt-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            {isValidating ? 'Finishing Up...' : 'Preview My Book'} <Sparkles className="w-6 h-6" />
                                        </button>
                                        {Object.keys(errors).length > 0 && <p className="text-center text-[10px] text-red-500 font-bold">Please fix the errors above to continue.</p>}
                                    </div>
                                </div>
                            )}

                            <button className="w-full mt-6 py-4 px-6 rounded-sm border-2 border-blue-50 hover:border-[#2563EB]/30 flex items-center justify-center gap-2 text-[#2563EB] font-bold text-sm transition-colors group cursor-pointer">
                                <ImageIcon className="w-4 h-4 text-[#2563EB]/40 group-hover:text-[#2563EB] transition-colors" />
                                Photo Formats & Dimensions Info
                            </button>
                        </div>

                        {/* Security Badge */}
                        <div className="mt-8 flex items-center justify-center gap-3 text-gray-500">
                            <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-gray-700">Private and secure, no third-party data use.</p>
                                <p className="text-[10px] text-gray-400 font-medium leading-none mt-1">Your images and information stay protected.</p>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#E2E0FF] rounded-sm mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
