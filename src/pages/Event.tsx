import Carousel from "@/components/Carousel/Carousel";
import img1 from "@/assets/carousel/car-new-1.png"
import img2 from "@/assets/carousel/car-new-2.png"
import img3 from "@/assets/carousel/car-new-3.png"
import img4 from "@/assets/carousel/car-new-4.png"

const Event = () => {
    const images = [
        img1,
        img2,
        img3,
        img4,
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Event Gallery</h1>
            <Carousel images={images} />
        </div>
    );
};

export default Event;