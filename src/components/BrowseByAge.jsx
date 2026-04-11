import { useNavigate } from 'react-router-dom';
import age2to4 from '../assets/images/age_2_4_toddler.jpg';
import age4to6 from '../assets/images/age_4_6_explorer.png';
import age6to8 from '../assets/images/age_6_8_adventure.jpg';

const AgeCard = ({ age, img }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/books', { state: { selectedAge: age } });
    };

    return (
        <div 
            onClick={handleClick}
            className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300 w-full aspect-[3/4.5] cursor-pointer"
        >
            <img
                src={img}
                alt={`Age ${age}`}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
            />

            {/* Dark Opacity Layer for better contrast */}
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-500"></div>

            {/* Top Age Text overlay */}
            <div className="absolute top-12 left-0 w-full text-center text-white drop-shadow-lg">
                <p className="text-lg md:text-xl font-medium tracking-tight opacity-90">Age</p>
                <p className="text-4xl md:text-5xl lg:text-6xl font-black">{age}</p>
            </div>

            {/* Bottom Discover Button - New Vibrant Style */}
            <div className="absolute bottom-12 left-0 w-full flex justify-center">
                <button className="bg-white hover:bg-white/90 text-gray-900 px-10 py-3.5 rounded-full text-[13px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 cursor-pointer">
                    Discover
                </button>
            </div>
        </div>
    );
};

export default function BrowseByAge() {
    return (
        <section id="browse-by-age" className="pt-14 pb-10 md:py-20 bg-white border-b-2 border-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-3 px-1">
                    <div>
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                            Browse Stories by Age
                        </h2>
                        <p className="text-gray-500 text-lg">Perfectly tailored adventures for every stage.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    <AgeCard
                        age="2-4"
                        img={age2to4}
                    />
                    <AgeCard
                        age="4-6"
                        img={age4to6}
                    />
                    <AgeCard
                        age="6-8"
                        img={age6to8}
                    />
                </div>
            </div>
        </section>
    );
}

