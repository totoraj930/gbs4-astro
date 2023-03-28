import { closeModal, focusTrap } from '@gbs/Column/Settings/SettingsModal';
import { globalSettings } from '@gbs/Store/globalSettings';
import clsx from 'clsx';
import { MsClose } from 'solid-material-symbols/rounded/600';
import { twMerge } from 'tailwind-merge';
import { MenuColumn } from '.';

type Props = {
  onClose?: () => void;
};
export function MenuOverlay(props: Props) {
  function onClose() {
    props.onClose?.();
  }
  return (
    <div
      class={clsx(
        'fixed top-0 left-0 h-full w-full',
        'z-[199] bg-[rgba(0,0,0,0.5)]'
      )}
    >
      <div
        class={clsx(
          'ml-auto h-full w-full max-w-[370px]',
          'relative pt-[50px] pl-[50px]'
        )}
      >
        <button
          onClick={() => onClose()}
          class={twMerge(
            clsx(
              'absolute left-0 bottom-[18px]',
              'h-[40px] w-[40px] place-content-center',
              'pointer-events-auto grid rounded-full',
              'bg-sky-500 text-white',
              {
                'shadow-[0_0_5px_#000]': globalSettings.darkMode,
                'shadow-[0_0_5px_rgba(0,0,0,0.5)]': !globalSettings.darkMode,
              }
            )
          )}
        >
          <MsClose size={26} />
        </button>
        <div
          class={clsx('h-full w-full', {
            'shadow-[0_0_5px_#000]': globalSettings.darkMode,
            'shadow-[0_0_5px_rgba(0,0,0,0.5)]': !globalSettings.darkMode,
          })}
          ref={(elm) => {
            closeModal(elm, onClose);
            focusTrap(elm);
          }}
        >
          <MenuColumn />
        </div>
      </div>
    </div>
  );
}
