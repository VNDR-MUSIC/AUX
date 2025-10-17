
'use client';

export default function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/80 z-10 backdrop-blur-sm" />
      <div style={{ position: 'relative', paddingTop: '56.25%', height: '0', width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <iframe
          src="https://player.viloud.tv/embed/channel/2968a991e17f1c819af7785fa4ee6654?autoplay=1&volume=0&controls=0&title=0&share=0&open_playlist=0&random=0"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            minWidth: '177.77vh', // 100/56.25
            minHeight: '100vw',
          }}
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
