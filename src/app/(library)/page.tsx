import { ClipGalleryRoute } from '@/components/gallery/gallery-route';
import { galleryPage } from '@/lib/gallery-catalog';
import { DEFAULT_FILTERS } from '@/lib/gallery-filters';

const HomePage = () => (
  <div className="w-full px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-10">
    <h1 className="sr-only">Library</h1>
    <ClipGalleryRoute initialPage={galleryPage(DEFAULT_FILTERS)} />
  </div>
);

export default HomePage;
