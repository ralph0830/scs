import { IDungeonCombat } from '@/types'

interface IExplorationLogProps {
    logs: string[];
    testId?: string;
}

export const ExplorationLog = ({ logs, testId }: IExplorationLogProps) => {
    return (
        <div 
            className="w-full h-96 bg-gray-900 text-white p-4 rounded-md overflow-y-auto font-mono"
            data-testid={testId}
        >
            {/* Logs */}
            <div className="space-y-1">
                {logs.length === 0 ? (
                    <p className="text-gray-500 italic">탐험을 시작하면 로그가 여기에 표시됩니다...</p>
                ) : (
                    logs.map((log, index) => (
                        <p key={index} className="whitespace-pre-wrap text-sm">
                            <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
                        </p>
                    ))
                )}
            </div>
        </div>
    );
}

export default ExplorationLog 