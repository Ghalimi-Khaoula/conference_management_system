const LoadingOverlay = () => {
    return (
        <div className="inset-0 mt-4 bg-opacity-50 flex items-center justify-center z-50">
            <div className="border-4 border-white border-t-violet-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
    );
};

export default LoadingOverlay;
