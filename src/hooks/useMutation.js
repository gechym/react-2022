import { useState } from 'react';
import { toast } from 'react-toastify';
import { MyStoreContexNavigate } from '../context/Store';

function useMutation() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let { setRefetching } = MyStoreContexNavigate(); // 1 aa

    const mutate = (callback) => {
        setLoading(true);
        callback()
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setRefetching((prev) => !prev);
                toast.success('Success!');
            })
            .catch((err) => {
                setError(err.response.data.msg);
                toast.error(err.response.data.msg);
                setLoading(false);
            })
            .finally(() => setLoading(false));
    };

    return { data, loading, error, mutate };
}

export default useMutation;
