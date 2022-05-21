import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useQuery from '../hooks/useQuery';
import Products from '../components/Products';

const Filter = () => {
    const { value, select: option } = useParams();
    const { data, loading, error } = useQuery(`/products?price[${option}]=${value}&limit=10`);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (data?.products) setProducts(data?.products);
    }, [data?.products]);

    return (
        <div>
            <Products products={products} />
            {loading && <h2>Loading...</h2>}
            {error && <h2>{error}</h2>}
        </div>
    );
};

export default Filter;
