'use client'

import CritterList from "@/components/CritterList";
import { ICritter } from "@/types";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface AuthPayload {
  userId: string;
  username: string;
  isAdmin?: boolean;
}

interface HomeClientProps {
  user: AuthPayload | null;
}

export default function HomeClient({ user }: HomeClientProps) {
  const { data: critters, error, isLoading } = useSWR<ICritter[]>('/api/critters', fetcher);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {user ? `환영합니다, ${user.username}님!` : 'SCS 프로젝트에 오신 것을 환영합니다.'}
        </p>
      </div>
      <div className="my-8 w-full">
        <h2 className="text-2xl font-bold mb-4">발견된 크리터</h2>
        {isLoading && <div className="text-center">불러오는 중...</div>}
        {error && <div className="text-center text-red-500">크리터 정보를 불러오지 못했습니다.</div>}
        {!isLoading && !error && critters && critters.length > 0 && (
          <CritterList />
        )}
        {!isLoading && !error && critters && critters.length === 0 && (
          <div className="text-center text-gray-500">
            아직 발견된 크리터가 없습니다. 관리자 페이지에서 크리터를 추가해주세요.
          </div>
        )}
      </div>
    </main>
  );
} 