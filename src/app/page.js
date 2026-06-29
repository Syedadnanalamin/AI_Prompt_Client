import Banner from "@/components/Banner";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import WhyChooseUs from "@/components/WhyChooseUs";
import PromptCategories from "@/components/PromptCategories";
import PromptPlayground from "@/components/PromptPlayground";
import TopCreators from "@/components/TopCreators";
import CustomerReviews from "@/components/CustomerReviews";
import { getFeaturedPrompts, getTopCreators } from "@/lib/api";

export const revalidate = 0; // Disable server component caching to ensure live content updates

export default async function Home() {
  const [featuredPrompts, topCreators] = await Promise.all([
    getFeaturedPrompts(),
    getTopCreators()
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <FeaturedPrompts initialPrompts={featuredPrompts} />
      <WhyChooseUs />
      <PromptCategories />
      <PromptPlayground />
      <TopCreators creators={topCreators} />
      <CustomerReviews />
    </div>
  );
}
