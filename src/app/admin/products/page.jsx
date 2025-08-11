'use client';
import { useSidebar } from '@/context/SidebarContext';
import {
    Menu, Search, User, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
    Eye, Edit, Trash2, SearchIcon, PlusSquare
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useMemo, useEffect, useRef, useActionState } from 'react';
import { signOutAction } from '../login/actions';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
    const { setSidebarOpen } = useSidebar();
    const [_, logoutAction] = useActionState(signOutAction, null);
    const [me, setMe] = useState(null);

    // Tuturial: Ambil user
    useEffect(() => {
        // ambil user yang sedang login
        const supabase = createClient();
        supabase.auth.getUser().then(({ data, error }) => {
            if (!error) setMe(data.user || null);
        });

        // kalau mau realtime update session (opsional)
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            setMe(session?.user ?? null);
        });
        return () => sub.subscription.unsubscribe();
    }, []);

    const displayName =
        me?.user_metadata?.name ||
        me?.user_metadata?.full_name ||
        me?.user_metadata?.display_name ||
        '';

    // === STATE ===
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // === EFFECT: outside click dropdown ===
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    // === LOAD PRODUCTS ===
    async function load(q = '') {
        setLoading(true);
        const url = q ? `/api/products?q=${encodeURIComponent(q)}` : '/api/products';
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
        setCurrentPage(1);
    }

    useEffect(() => { load(); }, []);
    useEffect(() => {
        const t = setTimeout(() => load(searchTerm), 250);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // === SORT HANDLER ===
    const handleSort = (field) => {
        if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDirection('asc'); }
    };

    // === FILTERED (search sudah di server, tapi keep guard jika ingin refine di client) ===
    const filteredData = useMemo(() => {
        if (!searchTerm) return products;
        const s = searchTerm.toLowerCase();
        return products.filter(p =>
            (p.title || '').toLowerCase().includes(s) ||
            (p.description || '').toLowerCase().includes(s) ||
            (p.price || '').toLowerCase().includes(s) ||
            (p.type || '').toLowerCase().includes(s) ||
            (Array.isArray(p.features) ? p.features.join(' ').toLowerCase().includes(s) : false)
        );
    }, [products, searchTerm]);

    // === SORTED ===
    const sortedData = useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const av = a[sortField];
            const bv = b[sortField];
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            if (typeof av === 'string') {
                return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
            }
            return sortDirection === 'asc' ? av - bv : bv - av;
        });
    }, [filteredData, sortField, sortDirection]);

    // === PAGINATION ===
    const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    // === HELPERS ===
    const FeatureBadges = ({ features }) => {
        if (!Array.isArray(features) || features.length === 0) return <span className="text-xs text-gray-400">-</span>;
        return (
            <div className="flex flex-wrap gap-1">
                {features.map((f, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {f}
                    </span>
                ))}
            </div>
        );
    };

    async function handleDelete(id) {
        if (!confirm('Hapus produk ini?')) return;
        const res = await fetch('/api/products', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const json = await res.json();
        if (json?.error) {
            alert(json.error);
        } else {
            await load(searchTerm);
        }
    }

    return (
        <>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-4 transition-colors">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <nav className="text-sm text-gray-500 dark:text-gray-400">
                                <span>Admin</span>
                                <span className="mx-2">/</span>
                                <span className="text-gray-900 dark:text-gray-200 font-medium">Products</span>
                            </nav>
                        </div>
                    </div>

                    {/* Dropdown Profile */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="rounded-full w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:ring-2 ring-blue-500 transition">
                            <User className="w-5 h-5" />
                        </button>

                        {/* Dropdown animated */}
                        <div
                            className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50 transform transition-all duration-200 ease-out origin-top-right ${dropdownOpen
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                {me && (
                                    <>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName || me.displayName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{displayName || me.email}</p>
                                    </>
                                )}
                            </div>
                            <form action={logoutAction}>
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-600/10 transition-colors">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row sm:justify-between mb-6">
                    <div className="flex flex-col md:flex-col-reverse justify-between items-start w-full sm:w-auto gap-0 md:gap-2 mb-4 md:mb-0">
                        <div className="flex flex-col gap-0 md:gap-1 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Product Management</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Kelola paket untuk UMKM, Perusahaan, dan Sekolah</p>
                        </div>
                        <Link href={'/admin/products/create'} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <PlusSquare className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Add Product</span>
                        </Link>
                    </div>

                    <button onClick={() => setShowMobileSearch(!showMobileSearch)} className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                        <SearchIcon className="w-4 h-4" />
                        <span>Search Feature</span>
                    </button>
                </div>

                {/* Search */}
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 transition-colors ${showMobileSearch ? 'block' : 'hidden sm:block'}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors">
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th onClick={() => handleSort('title')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <span>Title</span>
                                            {sortField === 'title' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('type')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <span>Type</span>
                                            {sortField === 'type' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <span>Price</span>
                                            {sortField === 'price' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</th>
                                    <th onClick={() => handleSort('created_at')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <span>Created</span>
                                            {sortField === 'created_at' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No products found</td></tr>
                                ) : paginatedData.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{p.title}</div>
                                            {p.description && <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 w-auto">{p.description}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{p.type}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {p.price || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <FeatureBadges features={p.features} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {p.created_at ? new Date(p.created_at).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center space-x-2 justify-end">
                                                <button className="text-blue-600 hover:text-blue-700 p-1 cursor-pointer" title="View">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <Link href={`/admin/products/${p.id}/edit`} className="text-green-600 hover:text-green-700 p-1 cursor-pointer" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700 p-1 cursor-pointer" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                        ) : paginatedData.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">No products found</div>
                        ) : (
                            paginatedData.map((p) => (
                                <div key={p.id} className="p-4">
                                    {/* Header: Title + Type badge */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                {p.title}
                                            </h3>
                                            {p.description && (
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 w-auto">
                                                    {p.description}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {p.type}
                                        </span>
                                    </div>

                                    {/* Middle: Price + Created */}
                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{p.price || '-'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Features</p>
                                        <FeatureBadges features={p.features} />
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center justify-end gap-3">
                                        <button
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                            title="View"
                                            onClick={() => alert('Detail view optional')}
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View</span>
                                        </button>
                                        <Link
                                            href={`/admin/products/${p.id}/edit`}
                                            className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-sm"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>


                    {/* Pagination */}
                    <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button key={page} onClick={() => setCurrentPage(page)}
                                                className={`px-3 py-1 text-sm rounded-md hover:cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
