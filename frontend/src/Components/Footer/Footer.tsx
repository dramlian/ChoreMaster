const Footer = () => {
    const version = import.meta.env.VITE_DEPLOYMENT_VERSION || 'local';
    
    return (
        <footer className="bg-dark text-light py-3">
            <div className="container text-center">
                <p className="mb-0">Version: {version}</p>
            </div>
        </footer>
    );
};

export default Footer;
