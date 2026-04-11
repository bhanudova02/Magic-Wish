import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import BookCard from '../components/BookCard';
import { books } from '../data/books';
import headerBg from '../assets/images/books_header_bg.jpg';

const FilterDropdown = ({ label, options, selected, onSelect, icon: Icon, isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="flex items-center justify-between min-w-[140px] px-5 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-400 transition-all text-sm font-bold text-gray-700 shadow-sm"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
                    <span className="text-gray-400 font-medium">{label}:</span>
                    <span className="text-[#2b124c] uppercase">
                        {isMulti
                            ? (selected.length === 0 ? 'All' : (selected.length === 1 ? selected[0] : `${selected.length} Selected`))
                            : selected}
                    </span>
                </div>
                {!Icon && <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
            </button>

            {isOpen && (
                <div className="absolute z-30 top-full left-0 w-full mt-2 py-2 bg-white border border-gray-100 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 min-w-[180px]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onSelect(opt.value);
                                if (!isMulti) setIsOpen(false);
                            }}
                            className={`w-full text-left px-5 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${(isMulti ? selected.includes(opt.value) : selected === opt.value)
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span>{opt.label}</span>
                            {(isMulti ? selected.includes(opt.value) : selected === opt.value) && (
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const toggleFilter = (list, setList, value) => {
    if (list.includes(value)) {
        setList(list.filter(item => item !== value));
    } else {
        setList([...list, value]);
    }
};

const FilterSection = ({ title, options, selectedList, setList }) => (
    <div className="mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#2b124c] mb-4 border-b border-gray-100 pb-2">{title}</h3>
        <div className="space-y-3">
            {options.map((opt) => (
                <label key={opt.value} className="flex items-center group cursor-pointer">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={selectedList.includes(opt.value)}
                            onChange={() => toggleFilter(selectedList, setList, opt.value)}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-sm checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none hidden peer-checked:block left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="ml-3 text-sm font-bold text-gray-600 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{opt.label}</span>
                </label>
            ))}
        </div>
    </div>
);

export default function BooksPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenders, setSelectedGenders] = useState([]);
    const [selectedAges, setSelectedAges] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState('gender');

    useEffect(() => {
        if (isFilterDrawerOpen || isSortDrawerOpen) {
            // Push a temporary state to history for handles back button
            window.history.pushState({ drawerOpen: true }, '');

            const handleHardwareBack = () => {
                // If the user clicks hardware back, close the drawers
                setIsFilterDrawerOpen(false);
                setIsSortDrawerOpen(false);
            };

            window.addEventListener('popstate', handleHardwareBack);
            return () => window.removeEventListener('popstate', handleHardwareBack);
        }
    }, [isFilterDrawerOpen, isSortDrawerOpen]);

    useEffect(() => {
        if (!isFilterDrawerOpen && !isSortDrawerOpen) {
            window.scrollTo(0, 0);
        }
    }, [searchQuery, selectedGenders, selectedAges, sortBy, isFilterDrawerOpen, isSortDrawerOpen]);

    const closeAllDrawers = () => {
        setIsFilterDrawerOpen(false);
        setIsSortDrawerOpen(false);
        
        // Scroll to top after a small delay to ensure drawer closure
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);

        // If we opened the drawer and pushed a state, go back once to clear it
        if (window.history.state?.drawerOpen) {
            window.history.back();
        }
    };

    const filteredBooks = useMemo(() => {
        let result = books.filter(book => {
            const matchesSearch = searchQuery === '' ||
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesGender = selectedGenders.length === 0 ||
                selectedGenders.includes(book.gender) ||
                book.gender === 'unisex';

            const matchesAge = selectedAges.length === 0 ||
                selectedAges.includes(book.age);

            return matchesSearch && matchesGender && matchesAge;
        });

        // Apply Sorting
        return [...result].sort((a, b) => {
            if (sortBy === 'price-low') {
                return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
            }
            if (sortBy === 'price-high') {
                return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
            }
            if (sortBy === 'newest') {
                return b.id - a.id; // Assuming higher ID is newer
            }
            return 0;
        });
    }, [searchQuery, selectedGenders, selectedAges, sortBy]);

    return (
        <div className="min-h-screen bg-white pt-[64px] pb-0">
            {/* Mobile Filter & Sort Bar */}
            <div className="lg:hidden sticky top-[64px] z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-black text-[#2b124c] uppercase tracking-widest"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filter</span>
                </button>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <button
                    onClick={() => setIsSortDrawerOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-black text-[#2b124c] uppercase tracking-widest"
                >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort</span>
                </button>
            </div>

            {/* Mobile Sort Drawer (Bottom Sheet Style) */}
            <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${isSortDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAllDrawers}></div>
                <div className={`absolute bottom-0 inset-x-0 bg-white rounded-t-3xl transition-transform duration-300 ease-out p-6 pt-2 pb-10 ${isSortDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                    <h3 className="text-lg font-black text-[#2b124c] uppercase tracking-tight mb-6">Sort By</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Newest Arrivals', value: 'newest' },
                            { label: 'Price: Low to High', value: 'price-low' },
                            { label: 'Price: High to Low', value: 'price-high' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => { setSortBy(option.value); closeAllDrawers(); }}
                                className={`w-full flex items-center justify-between p-4 rounded-xl text-sm font-bold transition-all ${sortBy === option.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 bg-gray-50'}`}
                            >
                                <span>{option.label}</span>
                                {sortBy === option.value && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Redesigned Mobile Filter Drawer (Screenshot Style) - With Smooth Transition */}
            <div className={`fixed inset-0 z-[100] lg:hidden flex flex-col bg-white transition-all ease-in-out ${isFilterDrawerOpen ? 'translate-x-0 opacity-100 duration-500' : '-translate-x-full opacity-0 pointer-events-none duration-300'}`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                    <h2 className="text-xl font-black text-[#2b124c]">Filters</h2>
                    <button
                        onClick={() => { setSelectedGenders([]); setSelectedAges([]); setSearchQuery(''); }}
                        className="text-sm font-black text-orange-600 uppercase tracking-widest"
                    >
                        Clear All
                    </button>
                </div>

                {/* Main Content (Two Columns) */}
                <div className="flex flex-grow overflow-hidden">
                    {/* Left Tabs */}
                    <div className="w-32 bg-gray-100/50 border-r border-gray-200 flex flex-col">
                        <button
                            onClick={() => setActiveMobileTab('gender')}
                            className={`px-4 py-6 text-left text-sm font-bold transition-all ${activeMobileTab === 'gender' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}
                        >
                            Gender
                        </button>
                        <button
                            onClick={() => setActiveMobileTab('age')}
                            className={`px-4 py-6 text-left text-sm font-bold transition-all ${activeMobileTab === 'age' ? 'bg-white text-indigo-600 border-l-4 border-indigo-600' : 'text-gray-500'}`}
                        >
                            Age Group
                        </button>
                    </div>

                    {/* Right Options */}
                    <div className="flex-grow bg-white overflow-y-auto p-8">
                        {activeMobileTab === 'gender' ? (
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-gray-400 mb-6">Choose Gender</h4>
                                {[
                                    { label: 'Boys', value: 'boy' },
                                    { label: 'Girls', value: 'girl' }
                                ].map((opt) => (
                                    <label key={opt.value} className="flex items-center group cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedGenders.includes(opt.value)}
                                                onChange={() => toggleFilter(selectedGenders, setSelectedGenders, opt.value)}
                                                className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-sm checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                                            />
                                            <svg className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="ml-4 text-base font-bold text-gray-700 uppercase tracking-tight">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-gray-400 mb-6">Choose Age</h4>
                                {[
                                    { label: 'Age 2-4', value: '2-4' },
                                    { label: 'Age 4-6', value: '4-6' },
                                    { label: 'Age 6-8', value: '6-8' }
                                ].map((opt) => (
                                    <label key={opt.value} className="flex items-center group cursor-pointer">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedAges.includes(opt.value)}
                                                onChange={() => toggleFilter(selectedAges, setSelectedAges, opt.value)}
                                                className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-sm checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                                            />
                                            <svg className="absolute w-4 h-4 text-white pointer-events-none hidden peer-checked:block left-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="ml-4 text-base font-bold text-gray-700 uppercase tracking-tight">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-white">
                    <button
                        onClick={closeAllDrawers}
                        className="text-sm font-black text-[#2b124c] uppercase tracking-widest px-8 py-2 border border-gray-200"
                    >
                        Close
                    </button>
                    <button
                        onClick={closeAllDrawers}
                        className="text-sm font-black text-orange-600 uppercase tracking-widest px-8 py-2 border border-gray-200"
                    >
                        Apply
                    </button>
                </div>
            </div>

            <div className="w-full px-0">

                <div className="flex flex-col lg:flex-row relative">
                    {/* Sidebar Filters - Desktop Only */}
                    <aside className="hidden lg:block w-72 flex-shrink-0 bg-gray-50/80 border-r border-gray-100 z-20">
                        <div className="lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] overflow-y-auto px-8 py-10">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                                <h2 className="text-xl font-black text-[#2b124c] tracking-tight">Filters</h2>
                                {(selectedGenders.length > 0 || selectedAges.length > 0) && (
                                    <button
                                        onClick={() => { setSelectedGenders([]); setSelectedAges([]); }}
                                        className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            <div className="mb-10">
                                <FilterSection
                                    title="Gender"
                                    options={[
                                        { label: 'Boys', value: 'boy' },
                                        { label: 'Girls', value: 'girl' }
                                    ]}
                                    selectedList={selectedGenders}
                                    setList={setSelectedGenders}
                                />

                                <FilterSection
                                    title="Age Group"
                                    options={[
                                        { label: 'Age 2-4', value: '2-4' },
                                        { label: 'Age 4-6', value: '4-6' },
                                        { label: 'Age 6-8', value: '6-8' }
                                    ]}
                                    selectedList={selectedAges}
                                    setList={setSelectedAges}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Main Area */}
                    <div className="flex-grow flex flex-col bg-[#fbfbff]">
                        {/* Main Toolbar area (Top of Grid) */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-8 md:py-4 lg:px-10 lg:py-6 bg-[#fbfbff]">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Results:</span>
                                <span className="text-sm font-black text-[#2b124c]">{filteredBooks.length} Books Found</span>
                            </div>

                            <div className="hidden lg:flex items-center gap-4">
                                <FilterDropdown
                                    label="Sort By"
                                    selected={
                                        sortBy === 'newest' ? 'Newest' :
                                            sortBy === 'price-low' ? 'Price: Low' :
                                                'Price: High'
                                    }
                                    onSelect={(val) => {
                                        if (val === 'Newest') setSortBy('newest');
                                        if (val === 'Price: Low') setSortBy('price-low');
                                        if (val === 'Price: High') setSortBy('price-high');
                                    }}
                                    options={[
                                        { label: 'Newest Arrivals', value: 'Newest' },
                                        { label: 'Price: Low to High', value: 'Price: Low' },
                                        { label: 'Price: High to Low', value: 'Price: High' }
                                    ]}
                                    icon={ArrowUpDown}
                                />
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="px-6 pb-10 md:px-10 md:pb-12 min-h-[calc(100vh-180px)]">
                            {filteredBooks.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredBooks.map((book) => (
                                        <BookCard key={book.id} {...book} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 bg-white border border-dashed border-gray-200 rounded-3xl">
                                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No stories match</h3>
                                    <p className="text-gray-400 text-sm">Update your search or filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

