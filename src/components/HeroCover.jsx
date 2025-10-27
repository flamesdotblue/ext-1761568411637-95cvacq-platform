import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] overflow-hidden">
      <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/0 to-white" />
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">Collaborative Docs</h1>
          <p className="text-neutral-600">Real-time, minimal, and focused writing.</p>
        </div>
      </div>
    </div>
  );
}
