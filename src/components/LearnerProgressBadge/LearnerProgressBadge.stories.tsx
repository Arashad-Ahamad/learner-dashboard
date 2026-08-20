import type { Meta, StoryObj } from '@storybook/react';
import LearnerProgressBadge from './LearnerProgressBadge';

const meta: Meta<typeof LearnerProgressBadge> = {
  title: 'Components/LearnerProgressBadge',
  component: LearnerProgressBadge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['default', 'in-progress', 'completed', 'disabled']
    },
    title: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100 } }
  }
};

export default meta;
type Story = StoryObj<typeof LearnerProgressBadge>;

export const Default: Story = {
  args: {
    status: 'default',
    title: 'Getting Started with React',
    progress: 0
  }
};

export const InProgress: Story = {
  args: {
    status: 'in-progress',
    title: 'JavaScript Fundamentals',
    progress: 65
  }
};

export const Completed: Story = {
  args: {
    status: 'completed',
    title: 'CSS Mastery Course',
    progress: 100
  }
};

export const Disabled: Story = {
  args: {
    status: 'disabled',
    title: 'Advanced TypeScript',
    progress: 30
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-96">
      <LearnerProgressBadge status="default" title="Not Started Course" progress={0} />
      <LearnerProgressBadge status="in-progress" title="Learning in Progress" progress={65} />
      <LearnerProgressBadge status="completed" title="Course Completed" progress={100} />
      <LearnerProgressBadge status="disabled" title="Locked Course" progress={30} />
    </div>
  )
};

export const Interactive: Story = {
  args: {
    status: 'in-progress',
    title: 'Click to Interact',
    progress: 50,
    onClick: () => alert('Badge clicked!')
  }
};
