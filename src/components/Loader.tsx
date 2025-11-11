import { Spinner } from "@maxhub/max-ui";

const Loader = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-white">
            <Spinner appearance="primary" size={32} />
        </div>
    );
};

export default Loader;
