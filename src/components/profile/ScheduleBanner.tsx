import scheduleImg from "../../assets/scheduler/scheduler.png"
import scheduleDecorImg from "../../assets/scheduler/decor.svg"
import { useNavigate } from "react-router-dom"

const ScheduleBanner = () => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate("/schedule")}
            className="overflow-hidden relative bg-gradient-to-r from-[#7848FF] to-[#000000] rounded-2xl shadow-sm p-6 mb-6 cursor-pointer hover:scale-[1.02] transition-transform"
        >
            <img className="absolute bottom-[-35%] -right-[40%] scale-75 -rotate-[20deg] rounded-[15px] border-[2px]" src={scheduleImg} alt=""/>
            <img className="absolute bottom-0 left-0" src={scheduleDecorImg} alt=""/>
            <div className="h-28">
                <h3 className="text-white mb-1 text-[18px]">Расписание занятий</h3>
                <p className="text-white/80 text-sm">Твое расписание всегда под рукой</p>
            </div>
        </div>
    )
}

export default ScheduleBanner
