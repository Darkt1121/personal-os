import { getYoutubePageData } from '@/modules/youtube/queries'
import { YouTubeHero } from '@/modules/youtube/components/YouTubeHero'
import { PipelineStrip } from '@/modules/youtube/components/PipelineStrip'
import { YouTubeContent } from '@/modules/youtube/components/YouTubeContent'
import { MesEnRevision } from '@/modules/youtube/components/MesEnRevision'

export const metadata = { title: 'YouTube — Personal OS' }

export default async function YoutubePage() {
  const data = await getYoutubePageData()

  const scriptsDraftCount = data.scripts.filter(s => s.status === 'borrador' || s.status === 'idea').length
  const productionCount = data.scripts.filter(s => s.status === 'revision' || s.status === 'aprobado').length
  const currentScript = data.scripts[0]?.title ?? null

  return (
    <div className="flex flex-col gap-4 p-6">
      <YouTubeHero
        ideasCount={data.ideas.length}
        scriptsDraftCount={scriptsDraftCount}
        productionCount={productionCount}
        currentScript={currentScript}
      />

      <PipelineStrip pipeline={data.pipeline} />

      <YouTubeContent ideas={data.ideas} scripts={data.scripts} />

      <MesEnRevision
        lastVideo={data.lastVideo}
        monthlyVideos={data.monthlyVideos}
        nextScheduled={data.nextScheduled}
      />
    </div>
  )
}
