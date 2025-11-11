import { Input } from "@maxhub/max-ui";
import { Search } from "lucide-react";

interface Props {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="mb-6">
            <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconBefore={<Search className="w-5 h-5 text-gray-400" />}
                mode="secondary"
                placeholder="Поиск скидок..."
            />
        </div>
    );
};

export default SearchBar;
