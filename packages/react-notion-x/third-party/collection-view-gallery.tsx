import * as React from 'react';
import { PageBlock } from 'notion-types';

import { CollectionViewProps } from '../types';
import { cs } from '../utils';
import { getCollectionGroups } from './collection-utils';
import { useNotionContext } from '../context';
import { CollectionCard } from './collection-card';
import { CollectionGroup } from './collection-group';

const defaultBlockIds = [];

export const CollectionViewGallery: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData,
}) => {
  const isGroupedCollection = collectionView?.format?.collection_group_by;

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(collection, collectionView, collectionData);

    return collectionGroups.map((group, index) => (
      <CollectionGroup key={index} {...group} collectionViewComponent={Gallery} />
    ));
  }

  const blockIds =
    (collectionData['collection_group_results']?.blockIds ?? collectionData.blockIds) ||
    defaultBlockIds;

  const articleLength: number = collectionView['page_sort']?.length || 0;

  return (
    <div>
      <span className="span--totally__article">전체 게시글: {articleLength}개</span>
      <Gallery collectionView={collectionView} collection={collection} blockIds={blockIds} />
    </div>
  );
};

function Gallery({ blockIds, collectionView, collection }) {
  const { recordMap } = useNotionContext();
  const {
    gallery_cover = { type: 'none' },
    gallery_cover_size = 'medium',
    gallery_cover_aspect = 'cover',
  } = collectionView.format || {};

  const limit = collectionView.format['inline_collection_first_load_limit'].limit || 0;

  return (
    <div className="">
      <div className="postListWrap">
        <div className={'postList'}>
          {limit === 0 && (
            blockIds?.map(blockId => {
              const block = recordMap.block[blockId]?.value as PageBlock;
              if (!block) return null;

              return (
                <CollectionCard
                  collection={collection}
                  block={block}
                  cover={gallery_cover}
                  coverSize={gallery_cover_size}
                  coverAspect={gallery_cover_aspect}
                  properties={collectionView.format?.gallery_properties}
                  key={blockId}
                />
              );
            })
          )}
          {limit !== 0 && (
            blockIds?.slice(0, limit).map(blockId => {
              const block = recordMap.block[blockId]?.value as PageBlock;
              if (!block) return null;

              return (
                <CollectionCard
                  collection={collection}
                  block={block}
                  cover={gallery_cover}
                  coverSize={gallery_cover_size}
                  coverAspect={gallery_cover_aspect}
                  properties={collectionView.format?.gallery_properties}
                  key={blockId}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
