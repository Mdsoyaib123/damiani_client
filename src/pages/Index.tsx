import Excellent from "@/components/index/Excellent";
import Extra from "@/components/index/Extra";
import Flexibility from "@/components/index/Flexibility";
import Grab from "@/components/index/Grab";
// import Interest from "@/components/index/Interest";
import Quality from "@/components/index/Quality";
import TopPicks from "@/components/index/TopPicks";
import WhyChoose from "@/components/index/WhyChoose";

const Index = () => {
  return (
    <div className="w-full flex flex-col">
      <Grab />
      <WhyChoose />
      <Flexibility />
      <Quality />
      <Excellent />
      <Extra />
      <TopPicks />
      {/* <Interest /> */}
    </div>
  );
};

export default Index;