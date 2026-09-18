import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";

const Homepage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) => {
  const category = (await searchParams).category;
  return (
    <div className="">
      <Slider />
      <ProductList category={category} params="homepage" />
    </div>
  );
};

export default Homepage;
