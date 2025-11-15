'use client';

import { useState, useRef } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface ImageRecognitionProps {
  onIngredientsDetected: (ingredients: string[]) => void;
}

// Map detected objects to common ingredients
const objectToIngredientMap: Record<string, string> = {
  'broccoli': 'broccoli',
  'carrot': 'carrot',
  'apple': 'apple',
  'banana': 'banana',
  'orange': 'orange',
  'pizza': 'pizza',
  'cake': 'cake',
  'hot dog': 'hot dog',
  'sandwich': 'sandwich',
  'bottle': 'bottle',
  'wine glass': 'wine',
  'cup': 'cup',
  'fork': 'fork',
  'knife': 'knife',
  'spoon': 'spoon',
  'bowl': 'bowl',
  'donut': 'donut',
};

export default function ImageRecognition({ onIngredientsDetected }: ImageRecognitionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const detectObjects = async (imageElement: HTMLImageElement) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load the COCO-SSD model
      const model = await cocoSsd.load();
      
      // Detect objects in the image
      const predictions = await model.detect(imageElement);

      // Map detected objects to ingredients
      const detectedIngredients = predictions
        .map(prediction => objectToIngredientMap[prediction.class.toLowerCase()])
        .filter(Boolean);

      const uniqueIngredients = Array.from(new Set(detectedIngredients));

      if (uniqueIngredients.length === 0) {
        setError('No recognizable ingredients found. Try uploading a clearer image or add ingredients manually.');
      } else {
        onIngredientsDetected(uniqueIngredients);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error detecting objects:', err);
      setError('Failed to analyze image. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);

      // Create an image element to pass to the detector
      const img = new Image();
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src = imageUrl;
          detectObjects(img);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!preview ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center py-8 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
            Upload an image of your ingredients
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            We'll try to identify the ingredients for you
          </p>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              ref={imageRef}
              src={preview}
              alt="Uploaded ingredients"
              className="w-full h-64 object-contain rounded-lg"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-2" />
                  <p>Analyzing image...</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <button
            onClick={() => {
              setPreview(null);
              setError(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Upload Different Image
          </button>
        </div>
      )}
    </div>
  );
}
