declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<
    SVGElement
  > & { title?: string }>;

  const src: string;
  export default src;
}