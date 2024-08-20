/* eslint-disable react/prop-types */
const Shop = ({ gold, inventoryFull, onPurchase }) => {
  function getItemUrl(name) {
    return new URL(`../assets/items/${name}.png`, import.meta.url).href;
  }

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f0f0f0',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Shop</h2>
      <label
        htmlFor='buy-crystal'
        className='shop-label'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: '20px',
          backgroundColor: '#d5d5d5',
          padding: '10px',
        }}
      >
        <div>
          {<img src={getItemUrl('crystal')} alt='Crystal' />}
          <p style={{ margin: '0' }}>Crystal (1 Gold)</p>
        </div>
        <button
          id='buy-crystal'
          onClick={() => onPurchase('Crystal')}
          disabled={gold < 1 || inventoryFull}
        >
          Buy
        </button>
      </label>
      <label
        htmlFor='buy-potion'
        className='shop-label'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: '20px',
          backgroundColor: '#d5d5d5',
          padding: '10px',
        }}
      >
        <div>
          {<img src={getItemUrl('potion')} alt='Potion' />}
          <p style={{ margin: '0' }}>Potion (1 Gold)</p>
        </div>
        <button
          id='buy-potion'
          onClick={() => onPurchase('Potion')}
          disabled={gold < 1}
        >
          Buy
        </button>
      </label>
    </div>
  );
};

export default Shop;
