import { useNavigate } from 'react-router-dom';
import HeroImg from '../../assets/scct.jpeg';

function LandingHeroPage() {

    const navigate = useNavigate();

  const style = {
    container: {
      backgroundImage: `url(${HeroImg})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "85vh",
    }
  }

  return (
    <>
      <div id='home' className='relative flex flex-col justify-center items-center text-center' style={style.container}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-primary-800/40 to-primary-900/70"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-8">
          <h3 className='text-white text-4xl md:text-5xl font-semibold tracking-tight animate-fadeInUp'>
            Welcome to CareerCell
          </h3>
          <p className="mt-4 text-primary-50 text-lg md:text-xl max-w-2xl mx-auto animate-fadeInUp" style={{animationDelay:'120ms'}}>
            A modern platform to manage placements, opportunities, and student success.
          </p>
          
        </div>
      </div>
    </>
  )
}

export default LandingHeroPage
