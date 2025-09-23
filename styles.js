import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  statBox: {
    backgroundColor: '#2ECC71',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    paddingVertical: 10,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#fff',
    borderRadius: 4,
    opacity: 0.9,
    marginVertical: 2,
  },
  barValue: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  barIndex: {
    color: '#fff',
    fontSize: 9,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  chartLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 8,
    opacity: 0.9,
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '47%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  serviceText: {
    color: '#fff',
    fontWeight: '600',
  },
  activitiesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  activityTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  activityDetail: {
    color: '#555',
    marginTop: 4,
  },
  activityAmount: {
    fontWeight: '700',
    marginTop: 5,
    fontSize: 14,
  },
})

export default styles