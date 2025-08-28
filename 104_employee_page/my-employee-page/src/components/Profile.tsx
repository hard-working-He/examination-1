"use client";

import React from 'react';
import Image from 'next/image';
import AvatarUpload from './AvatarUpload';

const Profile: React.FC = () => {
  const handleAvatarChange = (newAvatarSrc: string) => {
    // 可以在这里处理头像变化，比如上传到服务器
    console.log('Avatar changed:', newAvatarSrc);
  };

  return (
    
    <div className="w-1/2 m-auto border-2 border-gray-300 rounded-lg">
     {/*  背景图 */}
     <div className="w-full h-48 relative">
      <div className="w-full h-full absolute inset-0">
        <Image src="/background.png" alt="background" fill className="object-cover" />
      </div>
      
      {/* 头像 - 放在背景图容器内 */}
      <div className="absolute bottom-0 transform  translate-y-1/2 z-10 p-4">
        <AvatarUpload 
          defaultAvatar="/imgHeader.jpeg"
          size={96}
          onAvatarChange={handleAvatarChange}
        />
      </div>
     </div>
      {/* 个人信息 */}
      <div className="flex flex-col mt-16 p-4">
        <h1 className="text-2xl font-bold">郗鸣</h1>
        <p className="text-gray-500">学生</p>
        <p className="text-gray-500">德国</p> 
      </div>
        
    </div>
  );
};

export default Profile; 