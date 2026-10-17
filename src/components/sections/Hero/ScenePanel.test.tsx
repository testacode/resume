import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenePanel } from './ScenePanel';
import { shore } from './scenes/shore';

function setup() {
  const props = {
    choice: 'random' as const,
    onChoice: vi.fn(),
    scene: shore,
    config: { ...shore.defaults },
    onChange: vi.fn(),
    onReset: vi.fn(),
  };
  render(<ScenePanel {...props} />);
  return props;
}

const trigger = () => screen.getByRole('button', { name: 'Scene settings' });

describe('ScenePanel', () => {
  it('renders the π trigger closed', () => {
    setup();
    expect(trigger()).toHaveTextContent('π');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the dialog, picks a scene and closes with Escape', () => {
    const props = setup();
    fireEvent.click(trigger());
    expect(screen.getByRole('dialog', { name: 'Scene settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Random' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Shore' }));
    expect(props.onChoice).toHaveBeenCalledWith('shore');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('emits a full config on range, checkbox and color changes', () => {
    const props = setup();
    fireEvent.click(trigger());

    fireEvent.change(screen.getByLabelText('Run-up onto the sand'), { target: { value: '0.1' } });
    expect(props.onChange).toHaveBeenLastCalledWith({ ...shore.defaults, runup: 0.1 });

    fireEvent.click(screen.getByLabelText('Keep scene color'));
    expect(props.onChange).toHaveBeenLastCalledWith({ ...shore.defaults, keepColor: 0 });

    fireEvent.change(screen.getByLabelText('Sand'), { target: { value: '#123456' } });
    expect(props.onChange).toHaveBeenLastCalledWith({ ...shore.defaults, sand: '#123456' });
  });

  it('applies presets over defaults and resets', () => {
    const props = setup();
    fireEvent.click(trigger());

    fireEvent.click(screen.getByRole('button', { name: 'Risograph' }));
    expect(props.onChange).toHaveBeenLastCalledWith({ ...shore.defaults, ...shore.presets.Risograph });

    fireEvent.click(screen.getByRole('button', { name: 'Reset shore' }));
    expect(props.onReset).toHaveBeenCalledOnce();
  });
});
