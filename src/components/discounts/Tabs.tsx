import { Button } from "@maxhub/max-ui"
import { CreditCard, Percent } from "lucide-react"
import type { TabType } from "./types"

interface Props {
    activeTab: TabType
    setActiveTab: (tab: TabType) => void
}

const Tabs: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        { id: "cashback", label: "Кешбек по карте", icon: <CreditCard className="w-5 h-5 flex-shrink-0" /> },
        { id: "partners", label: "Скидки от партнеров", icon: <Percent className="w-5 h-5 flex-shrink-0" /> }
    ]

    return (
        <div className="flex gap-2 my-3">
            {tabs.map((tab) => (
                <Button
                    key={tab.id}
                    appearance={activeTab === tab.id ? "themed" : "neutral"}
                    mode="primary"
                    size="medium"
                    stretched
                    iconBefore={tab.icon}
                    onClick={() => setActiveTab(tab.id)}
                    innerClassNames={{
                        label: "flex items-center gap-2 whitespace-nowrap"
                    }}
                >
                    {tab.label}
                </Button>
            ))}
        </div>
    )
}

export default Tabs
