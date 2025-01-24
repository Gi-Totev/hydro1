import {Link} from 'react-router-dom';
import {Image, Money} from '@shopify/hydrogen-react';
import {useState, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

import {AddToCartButton} from '~/components/AddToCartButton';
import {URL_ADJACENT_VARIANTS} from '~/routes/api-adjacent-variants';

export default function ProductCard({product}) {
  const variantFetcher = useFetcher({key: `card-${product.id}`});

  const [variant, setVariant] = useState(
    product.selectedOrFirstAvailableVariant,
  );
  const [options, setOptions] = useState(product.options);
  const [adjacentVariants, setAdjacentVariants] = useState(
    product.adjacentVariants,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (variantFetcher.data?.error) {
      return setError(variantFetcher.data.error);
    }

    if (variantFetcher.data?.data?.product?.adjacentVariants) {
      const newAdjacentVariants =
        variantFetcher.data.data.product.adjacentVariants;

      if (
        JSON.stringify(newAdjacentVariants) !== JSON.stringify(adjacentVariants)
      ) {
        setAdjacentVariants(newAdjacentVariants);
      }
    }
  }, [variantFetcher.data]);

  useEffect(() => {
    if (variantFetcher.errors) {
      setError('Failed to fetch variant data. Please try again.');
    }
  }, [variantFetcher.errors]);

  const fetchVariants = async (options) => {
    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('selectedOptions', JSON.stringify(Object.values(options)));

    await variantFetcher.submit(formData, {
      method: 'post',
      action: URL_ADJACENT_VARIANTS,
    });

    setIsLoading(false);
  };

  const updateOptions = async (event) => {
    const select = event.target;
    const key = select.getAttribute('js-index');
    const newOptions = {
      ...variant.selectedOptions,
      [key]: {
        ...variant.selectedOptions[key],
        value: select.selectedOptions[0].getAttribute('js-name'),
      },
    };

    const newVariant = adjacentVariants.find((variant) => {
      return Object.keys(newOptions).every(
        (key) => newOptions[key].value == variant.selectedOptions[key].value,
      );
    });

    await fetchVariants(newOptions);

    if (!newVariant) return;

    setVariant(newVariant);
  };

  return (
    <div key={product.id} className="recommended-product">
      <Image
        data={product.images.nodes[0]}
        aspectRatio="1/1"
        sizes="(min-width: 45em) 20vw, 50vw"
      />

      <h4>
        <Link
          to={`/products/${product.handle}`}
          dangerouslySetInnerHTML={{__html: product.title}}
        ></Link>
      </h4>

      {error && <p>{error}</p>}

      {Object.keys(options).length > 0 && (
        <variantFetcher.Form method="post">
          {Object.entries(options).map(([key, option]) => (
            <select
              id={`${product.handle}-${option.name}`}
              js-index={key}
              key={'select' + key}
              onChange={updateOptions}
              defaultValue={variant.selectedOptions[key].value}
            >
              {Object.entries(option.optionValues).map(([optionKey, value]) => (
                <option
                  value={value.id}
                  key={'option' + optionKey}
                  js-name={value.name}
                  dangerouslySetInnerHTML={{__html: value.name}}
                ></option>
              ))}
            </select>
          ))}
        </variantFetcher.Form>
      )}

      <small>
        <Money data={variant.price} />
      </small>

      <AddToCartButton
        lines={[
          {
            merchandiseId: variant.id,
            quantity: 1,
          },
        ]}
      >
        Add To Cart
      </AddToCartButton>
    </div>
  );
}
