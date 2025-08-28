"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { PlusOutlined } from '@ant-design/icons';

interface AvatarUploadProps {
  defaultAvatar: string;
  size?: number;
  onAvatarChange?: (newAvatarSrc: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  defaultAvatar, 
  size = 96, 
  onAvatarChange 
}) => {
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarSrc(result);
        onAvatarChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg`}>
        <Image 
          src={avatarSrc} 
          alt="avatar" 
          width={size} 
          height={size} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      {/* 加号按钮 */}
      <div 
        className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
        style={{ zIndex: 9999 }}
        onClick={handlePlusClick}
      >
        <PlusOutlined className="text-blue-500 text-sm" />
      </div>
      
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload; 