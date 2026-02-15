import "./activities.css";

const events = [
  {
    id: 1,
    title: "复古Disco之夜",
    time: "06/15 19:30",
    cover: "/events/retro-disco.jpg",
    details: "80年代主题舞会，提供怀旧服装租赁和经典歌曲竞猜",
  },
  {
    id: 2,
    title: "职场角色互换日",
    time: "06/18 13:00",
    cover: "/events/career-exchange.jpg",
    details: "模拟医生/程序员/教师等职业场景的沉浸式体验",
  },
  {
    id: 3,
    title: "城市AR寻宝",
    time: "06/20 10:00",
    cover: "/events/city-explore.jpg",
    details: "组队探索老城区，通过AR技术解锁隐藏任务点",
  },
  {
    id: 4,
    title: "萌宠相亲会",
    time: "06/22 15:00",
    cover: "/events/pet-date.jpg",
    details: "宠物社交+专业营养师讲座，含免费体检环节",
  },
  {
    id: 5,
    title: "端午香囊工坊",
    time: "06/25 14:00",
    cover: "/events/dragon-boat.jpg",
    details: "手工制作艾草香囊，优秀作品将捐赠养老院",
  },
  {
    id: 6,
    title: "7喜好运签快闪",
    time: "06/28 16:00",
    cover: "/events/7up-event.jpg",
    details: "限定主题店体验，参与互动游戏赢取联名周边",
  },
];

// 其他活动数据...

const Activities = () => (
  <section className="activities-section">
    <h2>近期活动</h2>
    <div className="event-carousel">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          <img src={event.cover} alt={event.title} />
          <div className="event-info">
            <h3>{event.title}</h3>
            <p>{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
export default Activities;
