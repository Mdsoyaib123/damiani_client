import Carousel from "@/components/Carousel/Carousel";
import img1 from "@/assets/carousel/ep1.jpeg"
import img2 from "@/assets/carousel/ep2.jpeg"
import img3 from "@/assets/carousel/Gemini_Generated_Image_ncl0tjncl0tjncl0.jpeg"

const Event = () => {
    const images = [
        img1,
        img2,
        img3,
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Event Gallery</h1>
            <Carousel images={images} />
        </div>
    );
};

export default Event;