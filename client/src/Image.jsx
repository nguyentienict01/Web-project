import { useState } from "react";

export default function Image({src,...rest}) {
 const inputSrc = src && src.includes('https://')
    ? src
    : 'http://localhost:4000/uploads/'+src;

  const [renderSrc, setRenderSrc] = useState(inputSrc)
  return (
    <img {...rest} src={renderSrc} onError={() => {
      setRenderSrc('/fallbackImage.webp')
    } } alt={''} />
  );
}