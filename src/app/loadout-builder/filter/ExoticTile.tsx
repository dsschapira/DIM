import PressTip from 'app/dim-ui/PressTip';
import { t } from 'app/i18next-t';
import { DefItemIcon } from 'app/inventory/ItemIcon';
import { useD2Definitions } from 'app/manifest/selectors';
import clsx from 'clsx';
import React, { Dispatch } from 'react';
import { LoadoutBuilderAction } from '../loadout-builder-reducer';
import { LockedExoticWithPlugs } from '../types';
import styles from './ExoticTile.m.scss';

interface Props {
  exotic: LockedExoticWithPlugs;
}

interface ClickableProps extends Props {
  lbDispatch: Dispatch<LoadoutBuilderAction>;
  onClose(): void;
}

/**
 * A square tile container the exotic name, icon, and perk/mods info.
 *
 * When rendering perks a short description will be pulled from the SandboxPerk definition.
 * Mods on the other hand only get a name and icon as multiple descriptions takes up too
 * much room on screen.
 */
function ExoticTileContents({ exotic }: Props) {
  const defs = useD2Definitions()!;
  const { def, exoticPerk, exoticMods } = exotic;
  let perkShortDescription = exoticPerk?.displayProperties.description;

  if (exoticPerk) {
    for (const perk of exoticPerk.perks) {
      const description = defs.SandboxPerk.get(perk.perkHash)?.displayProperties.description;
      if (description) {
        perkShortDescription = description;
        break;
      }
    }
  }

  return (
    <>
      <div className={styles.itemName}>{def.displayProperties.name}</div>
      <div className={styles.details}>
        <div className={styles.itemImage}>
          <DefItemIcon itemDef={def} />
        </div>
        {exoticPerk && (
          <div key={exoticPerk.hash} className={styles.perkOrModInfo}>
            <div className={styles.perkOrModNameAndImage}>
              <DefItemIcon className={styles.perkOrModImage} itemDef={exoticPerk} />
              <div className={styles.perkOrModName}>{exoticPerk.displayProperties.name}</div>
            </div>
            <div className={styles.perkDescription}>{perkShortDescription}</div>
          </div>
        )}
        <div className={styles.mods}>
          {exoticMods?.map((mod) => (
            <div key={mod.hash} className={styles.perkOrModInfo}>
              <div className={styles.perkOrModNameAndImage}>
                <DefItemIcon className={styles.perkOrModImage} itemDef={mod} />
                <div className={styles.perkOrModName}>{mod.displayProperties.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function ExoticTile({ exotic, lbDispatch, onClose }: ClickableProps) {
  return (
    <div
      className={styles.exotic}
      onClick={() => {
        if (!exotic.isArmor1) {
          return;
        } else {
          lbDispatch({ type: 'lockExotic', lockedExotic: exotic });
          onClose();
        }
      }}
    >
      <ExoticTileContents exotic={exotic} />
    </div>
  );
}

export function Armor1ExoticTile({ exotic }: Props) {
  return (
    <PressTip
      className={clsx(styles.exotic, styles.disabled)}
      tooltip={<div>{t('LB.IncompatibleWithOptimizer')}</div>}
    >
      <ExoticTileContents exotic={exotic} />
    </PressTip>
  );
}
