import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
// components
import Label from 'src/components/label';
// utils
import { fIndianCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function WaterfallEngine({ steps }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Waterfall Engine
      </Typography>

      <Timeline
        sx={{
          p: 0,
          m: 0,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {steps.map((item, index) => (
          <WaterfallItem
            key={item.name}
            item={item}
            lastStep={index === steps.length - 1}
          />
        ))}
      </Timeline>
    </Card>
  );
}

WaterfallEngine.propTypes = {
  steps: PropTypes.array,
};

// ----------------------------------------------------------------------

function WaterfallItem({ item, lastStep }) {
  const { name, amount, status } = item;

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (status === 'completed' && 'success') ||
            (status === 'in-progress' && 'primary') ||
            'grey'
          }
        />
        {!lastStep && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="h6">{fIndianCurrency(amount)}</Typography>
          </Stack>

          <Label
            variant="soft"
            color={
              (status === 'completed' && 'success') ||
              (status === 'in-progress' && 'info') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {status.replace('-', ' ')}
          </Label>
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
}

WaterfallItem.propTypes = {
  item: PropTypes.object,
  lastStep: PropTypes.bool,
};
