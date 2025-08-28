import React from 'react';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ header, footer, children }) => {
  return (
    <div className="w-1/2 p-4 m-auto border-2 border-gray-300 rounded-lg mt-2">
      {header && (
        <div className="flex justify-between items-center">
          {header}
          <div className="flex items-center">
            <button className="w-10 h-10 mr-2 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
              <PlusOutlined className="text-lg" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
              <EditOutlined className="text-lg" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-4 pb-4">
        {children}
      </div>

      {footer && (
        <div className="border-t-1 border-gray-100 flex justify-center items-center pt-4 hover:cursor-pointer hover:text-blue-800">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;