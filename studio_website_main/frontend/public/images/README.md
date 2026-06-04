# Local Images Folder

You can store your local static image assets here (e.g. logos, background graphics, portraits).

### How to use:
Any image saved in this folder can be referenced inside your React code directly by its path relative to the `public` directory.

For example, if you save an image named `camera.jpg` in this directory, you can render it in your code like this:
```tsx
import Image from 'next/image';

<Image
  src="/images/camera.jpg"
  alt="Camera"
  width={800}
  height={600}
/>
```
