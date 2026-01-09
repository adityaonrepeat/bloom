// import { getEmotionLevel } from "../utils/emotion"

// export default function Result() {
//   const score = Number(localStorage.getItem("emotion-score"))
//   const level = getEmotionLevel(score)

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-4">
//         <h1 className="text-2xl font-bold">Your Result</h1>
//         <p className="text-lg">Score: {score}</p>
//         <p className="text-xl font-semibold text-emerald-600">
//           {level}
//         </p>
//       </div>
//     </div>
//   )
// }

import { useNavigate } from "react-router-dom"
import { getEmotionLevel } from "../utils/emotion"

export default function Result() {
  const navigate = useNavigate()
  const score = Number(localStorage.getItem("emotion-score"))
  const level = getEmotionLevel(score)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center space-y-6 w-full max-w-md">
        
        <h1 className="text-2xl font-bold">Your Result</h1>

        <div className="space-y-2">
          <p className="text-lg">Score: {score}</p>
          <p className="text-xl font-semibold text-emerald-600">
            {level}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/match")}
            className="w-full h-12 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
          >
            Talk to Someone
          </button>

          <button
            onClick={() => navigate("/chat")}
            className="w-full h-12 rounded-xl border border-slate-300 text-slate-800 font-medium hover:bg-slate-100 transition"
          >
            Talk to Bloom AI
          </button>
        </div>

      </div>
    </div>
  )
}

