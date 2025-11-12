import { Button } from "@maxhub/max-ui";
import type { TabType } from "./types";

interface Props {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
}

const Tabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const tabs: { id: TabType; label: string }[] = [
        { id: "cashback", label: "Кешбек по карте" },
        { id: "partners", label: "Скидки от партнеров" }
    ];

    return (
        <div className="flex gap-2 my-3">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    appearance={activeTab === tab.id ? "themed" : "neutral"}
                    mode="primary"
                    size="medium"
                    stretched
                    onClick={() => setActiveTab(tab.id)}
                    className="flex min-w-[160px] flex-1 items-center justify-center whitespace-normal text-center text-sm font-semibold leading-tight"
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    );
};

export default Tabs;
