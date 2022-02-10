import InfoLayout from 'components/Layout/Info';
import React, { ReactElement } from 'react'

function TokensPage() {
  return (
    <div>TokensPage</div>
  )
}

TokensPage.getLayout = function getLayout(page: ReactElement) {
    return <InfoLayout>{page}</InfoLayout>;
};

export default TokensPage