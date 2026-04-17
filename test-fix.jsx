import React from 'react';

const TestFix = () => {
    return (
        <div>
            {/* YouTube - HAS pointer-events-none ✓ */}
            <div className="absolute inset-0 bg-transparent cursor-default pointer-events-none" />

            {/* TikTok - HAS pointer-events-none ✓ */}
            <div className="absolute inset-0 bg-transparent cursor-default pointer-events-none" />

            {/* Instagram - FIXED: Added pointer-events-none ✗ -> ✓ */}
            <div className="absolute inset-0 bg-transparent cursor-default pointer-events-none" />
        </div>
    );
};

export default TestFix;
