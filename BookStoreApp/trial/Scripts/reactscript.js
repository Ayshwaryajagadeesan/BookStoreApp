var createClass = function () {
    function defineProperties(target, props)
    {
        for (var i = 0; i < props.length; i++)
        {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    } return function (Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
            defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.proto = superClass; }

var BookComponent = function (React$Component) {
    inherits(BookComponent, React$Component);

    function BookComponent(props) {
        classCallCheck(this, BookComponent);

        var this_1 = possibleConstructorReturn(this, (BookComponent.proto || Object.getPrototypeOf(BookComponent)).call(this, props));

        this_1.state = {
            bookList: [],
            chosenList: [],
            totalSP: props.SP,
            restSP: props.SP,
            insufficientSP: false
        };

        this_1.addToChosen = this_1.addToChosen.bind(this_1);
        this_1.insufficientSP = this_1.insufficientSP.bind(this_1);
        return this_1;
    }

    createClass(BookComponent, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.loadBookList();
        }
    }, {
        key: 'addToChosen',
        value: function addToChosen(itemId, itemSP, state) {
            var chosenList = this.state.chosenList;
            var bookList = this.state.bookList;
            var restSP = this.state.restSP;

            if (!chosenList.length) {
                chosenList = bookList.filter(function (item, index) {
                    return itemId === item.id;
                });

                restSP -= itemSP;
                this.setState({ chosenList: chosenList });
                this.setState({ restSP: restSP });
                return;
            } else {
                var notAdded = chosenList.every(function (item, index) {
                    if (item.id === itemId) {
                        chosenList.splice(index, 1);
                        restSP += item.SP;

                        return false;
                    } else {
                        return true;
                    }
                });

                if (notAdded) {
                    bookList.forEach(function (item) {
                        if (item.id === itemId) {
                            chosenList.push(item);
                            restSP -= itemSP;
                        }
                    });
                }

                this.setState({ chosenList: chosenList });
                this.setState({ restSP: restSP });
            }

            this.setState({ insufficientSP: false });
        }
    }, {
        key: 'insufficientSP',
        value: function insufficientSP() {
            this.setState({ insufficientSP: true });
        }
    }, {
        key: 'loadBookList',
        value: function loadBookList() {
            var this_2 = this;

            $.ajax({
                url: '/home/savedata1',
                type: 'GET',
                dataType: 'json'
            }).done(function (list) {
                if (list) {
                    this_2.setState({ bookList: list });
                }
            }).fail(function (error) {
                console.log(error.status);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'book-wrapper' },
                React.createElement(
                    'div',
                    { className: 'book-picker' },
                    React.createElement(BookList, {
                        restSP: this.state.restSP,
                        list: this.state.bookList,
                        addChosen: this.addToChosen,
                        insufficient: this.insufficientSP
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'book-chosen' },
                    React.createElement(BookChosen, {
                        sp: this.state.restSP,
                        total: this.state.totalSP,
                        list: this.state.chosenList,
                        insufficientState: this.state.insufficientSP
                    })
                )
            );
        }
    }]);

    return BookComponent;
}(React.Component);
//It is the middle pane.Contains the Book List item
var BookList = function (React$Component2) {
    inherits(BookList, React$Component2);

    function BookList(props) {
        classCallCheck(this, BookList);

        return possibleConstructorReturn(this, (BookList.proto || Object.getPrototypeOf(BookList)).call(this, props));
    }

    createClass(BookList, [{
        key: 'render',
        value: function render() {
            var this_4 = this;

            var bookList = this.props.list.map(function (listItem, index) {
                return React.createElement(BookListItem, {
                    key: index,
                    restSP: this_4.props.restSP,
                    listInfo: listItem,
                    addChosen: this_4.props.addChosen,
                    insufficient: this_4.props.insufficient
                });
            });

            return React.createElement(
                'ul',
                null,
                bookList
            );
        }
    }]);

    return BookList;
}(React.Component);
//It is a the card view of the react.It renders the individual book images and information
var BookListItem = function (React$Component3) {
    inherits(BookListItem, React$Component3);
        function BookListItem(props) {
        classCallCheck(this, BookListItem);

        var this_5 = possibleConstructorReturn(this, (BookListItem.proto || Object.getPrototypeOf(BookListItem)).call(this, props));

        this_5.state = {
            active: false
        };
        return this_5;
    }

    createClass(BookListItem, [{
        key: 'onListItemClick',
        value: function onListItemClick(itemId, itemSP, event) {
            var active = this.state.active;

            //if (this.props.restSP - itemSP < 0 && !active) {
            //    this.props.insufficient();
            //    return;
            //};

            this.setState({ active: !active });
            this.props.addChosen(itemId, itemSP, active);
        }
    }, {
        key: 'render',
        value: function render() {
            var chosenClass = "book-item";
            var book = this.props.listInfo;

            chosenClass += this.state.active ? " picked" : "";

            return React.createElement(
                'li',
                { onClick: this.onListItemClick.bind(this, book.id, book.SP), className: chosenClass },
                React.createElement(
                    'h4',
                    null,
                    book.name
                ),
                React.createElement('img', { src: book.img }),
                React.createElement(
                    'div',
                    { className: 'book-description' },
                    React.createElement(
                        'ul',
                        null,
                        React.createElement(
                            'li',
                            null,
                             React.createElement(
                                'span',
                                { className: 'display: block' },
                            //    skill.level
                            )
                        ),
                        React.createElement(
                            'li',
                            null,
                            'Book Category ',
                            React.createElement(
                                'span',
                                { className: 'book-value' },
                                book.type
                            )
                        ),
                        React.createElement(
                            'li',
                            null,
                            'Cost ',
                            React.createElement(
                                'span',
                                { className: 'book-value' },
                                book.SP
                            )
                        )
                    ),
                    React.createElement(
                        'p',
                        { className: 'book-info' },
                        book.info
                    )
                )
            );
        }
    }]);

    return BookListItem;
}(React.Component);
//It is the right pane.It contains the Books chosen by the user.It is the cart.
var BookChosen = function (React$Component4) {
    inherits(BookChosen, React$Component4);

    function BookChosen() {
        classCallCheck(this, BookChosen);

        return possibleConstructorReturn(this, (BookChosen.proto || Object.getPrototypeOf(BookChosen)).apply(this, arguments));
    }

    createClass(BookChosen, [{
        key: 'render',
        value: function render() {
            var insufficientMessage = void 0;

            var chosenItems = this.props.list.map(function (item, index) {
                return React.createElement(BookChosenItem, { key: index, item: item });
            });

            if (this.props.insufficientState) {
                insufficientMessage = React.createElement(
                    'div',
                    { className: 'insufficientSP' },
                    
                );
            }

            return React.createElement(
                'div',
                { className: 'book-panel' },
                React.createElement(
                    'h4',
                    null,
                    'Books Chosen: ',
                    React.createElement(
                        'span',
                        { className: 'book-SP' },
                        //this.props.sp

                    )
                ),
                React.createElement(
                    'ul',
                    { className: 'book-items' },
                    chosenItems
                ),
                //insufficientMessage
            );
        }
    }]);

    return BookChosen;
}(React.Component);
//It is the list item in the cart.It renders the image and title of the chosen book
var BookChosenItem = function (React$Component5) {
    inherits(BookChosenItem, React$Component5);

    function BookChosenItem() {
        classCallCheck(this, BookChosenItem);

        return possibleConstructorReturn(this, (BookChosenItem.proto|| Object.getPrototypeOf(BookChosenItem)).apply(this, arguments));
    }

    createClass(BookChosenItem, [{
        key: 'render',
        value: function render() {
            var item = this.props.item;
            return React.createElement(
                'li',
                null,
                React.createElement('img', { src: item.img, alt: '' }),
                React.createElement(
                    'span',
                    null,
                    item.name
                ),

            );
        }
    }]);
    return BookChosenItem;
}(React.Component);

var SP = 0;
React.render(React.createElement(BookComponent, { SP: SP }), document.querySelector('.list-select'));

