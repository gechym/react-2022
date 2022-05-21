import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Products from '../components/Products';
import Sorting from '../components/Sorting';
import { MyStoreContexNavigate } from '../context/Store';
import useQuery from '../hooks/useQuery';

const Search = () => {
    const [products, setProducts] = useState([]);
    const { search } = useParams();
    const { sort, refetching } = MyStoreContexNavigate();

    const [limit] = useState(2);
    const [page, setPage] = useState(1);
    const [stop, setStop] = useState(false);
    const [firtsLoad, setFirstLoad] = useState(false);
    const btnRef = useRef();

    const { data, loading, error } = useQuery(`/products?search=${search}&sort=${sort}&limit=${limit}&page=${page}`, {
        refetching,
    });

    useEffect(() => {
        if (data?.products) {
            setFirstLoad(true);
            setProducts((prev) => [...prev, ...data.products]);
            if (data.products.length < limit) setStop(true);
        }
    }, [data?.products, limit]);

    useEffect(() => {
        setPage(1);
        setStop(false);
        setProducts([]);
    }, [search, sort, refetching]);

    const handleLoadMore = useCallback(() => {
        if (stop) return;
        setPage((prev) => prev + 1);
    }, [stop]);

    useEffect(() => {
        const btn = btnRef.current;

        const observer = new IntersectionObserver((entrins) => {
            if (entrins[0].isIntersecting && firtsLoad) {
                handleLoadMore();
            }
        });

        if (btn) {
            observer.observe(btn);
        }

        return () => {
            if (btn) observer.unobserve(btn);
        };
    }, [firtsLoad, handleLoadMore]);

    return (
        <div>
            <Sorting />
            <Products products={products} />
            {loading && <h2>Loading...</h2>}
            {error && <h2>{error}</h2>}
            <button ref={btnRef} className="btn-load_more" onClick={handleLoadMore} disabled={stop}>
                Load more
            </button>
        </div>
    );
};

export default Search;
