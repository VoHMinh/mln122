import HeroSection from '@/components/sections/HeroSection';
import StoryJourney from '@/components/sections/StoryJourney';
import StoryAtmosphere from '@/components/ui/StoryAtmosphere';
import TargetCursor from '@/components/ui/TargetCursor';

export default function Home() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#07131a]">
      <StoryAtmosphere />
      <HeroSection />
      <StoryJourney />
      <TargetCursor followOnly cursorColor="#41d6c3" spinDuration={3.6} />
    </main>
  );
}
