// SkeletonLoader.jsx
import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ width = '200px', height = '20px', marginBottom = '10px' }) => (
    <div className="skeleton" style={{ width, height, marginBottom }}></div>
);

export default SkeletonLoader;
