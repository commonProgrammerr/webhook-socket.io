import Alert from '../models/Alert';

export default {
  render(alert: Alert, lazy = true) {
    return {
      id: alert.id,
      alert_status: alert.alert_status,
      device_mac: alert.device_mac,
      created_at: alert.created_at,
      updated_at: alert.updated_at
    };
  },

  renderMany(alerts: Alert[]) {
    return alerts.map((alert) => this.render(alert));
  },
};