import { useState } from "react";

export default function Image({src,...rest}) {
  console.log(src);
 const inputSrc = src && String (src).includes('https://')
    ? src
    : 'http://localhost:4000/uploads/'+src;

  const [renderSrc, setRenderSrc] = useState(inputSrc)
  return (
    <img {...rest} src={renderSrc} onError={() => {
      setRenderSrc('/fallbackImage.webp')
    } } alt={''} />
  );
}