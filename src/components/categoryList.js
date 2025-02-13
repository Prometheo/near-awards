import { useEffect, useState, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import styles from '@/styles/app.module.css';
import Link from 'next/link';

import { HelloNearContract } from '../config';
import { Clock as ClockIcon, ChevronLeft, Crown, Layers, DollarSign, HandHelping, Zap, Clapperboard, BriefcaseBusiness, Award } from 'lucide-react';

export const CategoryList = () => {
  const { wallet } = useContext(NearContext);
  const [categories, setCategories] = useState([]);

  const categoryIcons = {
    1: Crown,
    2: Layers,
    3: DollarSign,
    4: HandHelping,
    5: Zap,
    6: Clapperboard,
    7: BriefcaseBusiness,
    8: Award,
  };

  useEffect(() => {
    if (!wallet) return;

    const fetchCategories = async () => {
      const categories = await wallet.viewMethod({
        contractId: HelloNearContract,
        method: 'get_elections',
      });
      setCategories(categories);
    };

    fetchCategories();
  }, [wallet]);

  const getVotingStatus = (startDate, endDate) => {
    const now = Date.now();
    if (now < parseInt(startDate)) {
      return { status: 'NOT_STARTED', color: 'yellow' };
    } else if (now > parseInt(endDate)) {
      return { status: 'ENDED', color: 'red' };
    }
    return { status: 'ACTIVE', color: 'green' };
  };

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4">NEAR Protocol Awards 2025</h1>
        <p className="text-base md:text-lg text-gray-700">Celebrate and recognize excellence in the NEAR ecosystem</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`} aria-label={`Go to ${category.title}`}>
            <div className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer h-[250px] hover:scale-[1.05] hover:bg-gray-50">
              <div className="absolute top-4 right-4">
                {(() => {
                  const { status, color } = getVotingStatus(category.start_date, category.end_date);
                  return (
                    <div className={`flex items-center bg-${color}-100 text-${color}-800 text-sm px-3 py-1 rounded-full`}>
                      <ClockIcon size={14} className="mr-1" />
                      <span>
                        {status === 'ACTIVE' && 'Voting Active'}
                        {status === 'NOT_STARTED' && 'Voting Not Started'}
                        {status === 'ENDED' && 'Voting Ended'}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="p-6 flex flex-col h-full">
                {(() => {
                  const Icon = categoryIcons[category.id] || Award;
                  return <Icon className="w-12 h-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 mb-4 flex-shrink-0" />;
                })()}
                <h2 className="text-xl font-semibold mb-2 text-black group-hover:text-blue-700 transition-colors duration-300 flex-shrink-0">
                  {category.title || 'Loading...'}
                </h2>
                <p className="text-gray-600 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                  {category.description || 'No description available'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};